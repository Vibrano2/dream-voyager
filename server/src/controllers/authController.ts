import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import supabase from '../config/supabase.js';

// @desc    Register a new user
export const signup = async (req: Request, res: Response) => {
    const { email, password, fullName, phone, role = 'customer' } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Please provide email, password, and full name' });
    }

    try {
        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    role: role
                }
            }
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        if (!authData.user) {
            return res.status(400).json({ error: 'User creation failed' });
        }

        // 2. Create profile in public.profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: authData.user.id,
                    email: email,
                    full_name: fullName,
                    phone: phone,
                    role: role
                }
            ]);

        if (profileError) {
            console.error('Profile creation failed:', profileError);
            return res.status(500).json({ error: 'User created but profile setup failed' });
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                role: role,
                full_name: fullName
            },
            session: authData.session
        });

    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Authenticate user & get token
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        // Use User Context for RLS compatibility
        // Now that we have a session, we can act AS the user to read/write their own profile.
        const token = data.session.access_token;
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY!;

        const userClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        // Fetch user profile to get the role
        let { data: profile, error: profileError } = await userClient
            .from('profiles')
            .select('role, full_name, avatar_url')
            .eq('id', data.user.id)
            .single();

        // Self-healing: Create profile if missing
        if (!profile) {
            console.log('Profile missing for user, creating one...');
            const { data: newProfile, error: createError } = await userClient
                .from('profiles')
                .insert({
                    id: data.user.id,
                    email: data.user.email,
                    // Use metadata or default
                    full_name: data.user.user_metadata?.full_name || email.split('@')[0],
                    role: data.user.user_metadata?.role || 'customer'
                })
                .select()
                .single();

            if (!createError && newProfile) {
                profile = newProfile;
            } else {
                console.error('Failed to auto-create profile:', createError);
            }
        }

        // Sync: If Auth Metadata says admin, but Profile doesn't, trust Auth and update Profile
        if (data.user.user_metadata?.role === 'admin' && profile?.role !== 'admin') {
            console.log('Syncing Admin role from Auth to Profile...');
            const { data: updatedProfile, error: syncError } = await userClient
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', data.user.id)
                .select()
                .single();

            if (!syncError && updatedProfile) {
                profile = updatedProfile;
            }
        }

        // SECURITY: Prioritize Database Profile Role over JWT Metadata
        // We treat the database 'profiles' table as the single source of truth.
        const effectiveRole = profile?.role || 'customer';

        // Optional warning if they mismatch (for debugging)
        if (data.user.user_metadata?.role === 'admin' && effectiveRole !== 'admin') {
            console.warn(`[Login] Security Warning: User ${data.user.email} has 'admin' in metadata but '${effectiveRole}' in DB. Using DB role.`);
        }

        res.json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                user_metadata: data.user.user_metadata, // Keep for reference if needed, but UI should favor 'role'
                role: effectiveRole,
                full_name: profile?.full_name || data.user.user_metadata?.full_name,
                avatar_url: profile?.avatar_url
            },
            session: data.session
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Logout user
export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const { error } = await supabase.auth.signOut();
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
};

// @desc    Get current user profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        // Use User Context for RLS compatibility
        const token = req.headers.authorization?.split(' ')[1];
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY!;

        const userClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: profile, error } = await userClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('[Get Profile] Failed to fetch profile:', error);
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                ...profile
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
