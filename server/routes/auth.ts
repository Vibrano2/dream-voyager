import express, { Request, Response } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req: Request, res: Response) => {
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
        // Note: We're doing this manually here, but sophisticated setups might use a Postgres Trigger
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
            // Ideally we might want to rollback the auth user creation here, but for now log error
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
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
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

        // Fetch user profile to get the role
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name, avatar_url')
            .eq('id', data.user.id)
            .single();

        // Self-healing: Create profile if missing
        if (!profile) {
            console.log('Profile missing for user, creating one...');
            const { data: newProfile, error: createError } = await supabase
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
        // This fixes the issue where a user is made admin in Supabase Auth but Profiles table lags behind
        if (data.user.user_metadata?.role === 'admin' && profile?.role !== 'admin') {
            console.log('Syncing Admin role from Auth to Profile...');
            const { data: updatedProfile, error: syncError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', data.user.id)
                .select()
                .single();

            if (!syncError && updatedProfile) {
                profile = updatedProfile;
            }
        }



        // Force 'admin' if metadata says so, otherwise use profile role
        const metadataRole = data.user.user_metadata?.role;
        const profileRole = profile?.role;
        const effectiveRole = metadataRole === 'admin' ? 'admin' : (profileRole || 'customer');

        res.json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                user_metadata: data.user.user_metadata,
                role: effectiveRole, // Force calculated role
                full_name: profile?.full_name || data.user.user_metadata?.full_name,
                avatar_url: profile?.avatar_url
            },
            session: data.session
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private (requires token to logout properly on server side if needed, but mostly client side)
router.post('/logout', async (req: Request, res: Response) => {
    try {
        // Supabase signout invalidates the session
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const { error } = await supabase.auth.signOut();
            // signOut does not take token in JS client, it relies on current session.
            // For stateless backend, we can't easily invalidate the token on Supabase side 
            // without admin API methods like admin.signOut(uid).
            // But for now, we'll just acknowledge the request.
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', requireAuth, async (req: Request, res: Response) => {
    try {
        const user = req.user;

        // Fetch full profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
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
});

export default router;
