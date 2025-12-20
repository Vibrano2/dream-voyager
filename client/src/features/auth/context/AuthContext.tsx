import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../../../services/api';
import { supabase } from '../../../services/supabase';

// Types
interface User {
    id: string;
    email: string;
    full_name?: string;
    role?: 'admin' | 'customer' | 'agent';
    phone?: string;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to handle inconsistent backend responses (nested profile vs flat)
const normalizeUser = (userData: any): User | null => {
    if (!userData) return null;

    // Check if we have a nested profile object
    const profile = userData.profile || {};

    return {
        id: userData.id,
        email: userData.email,
        // Prefer top-level properties, fallback to profile properties
        phone: userData.phone || profile.phone,
        role: userData.role || profile.role,
        avatar_url: userData.avatar_url || profile.avatar_url,
        full_name: userData.full_name || profile.full_name || profile.fullName
    };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => {
        try {
            return localStorage.getItem('token');
        } catch (error) {
            console.error('Failed to access localStorage:', error);
            return null;
        }
    });
    const [loading, setLoading] = useState(true);



    // Load user profile on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    // Fetch user profile from backend
                    const response = await api.get('/auth/me');
                    setUser(normalizeUser(response.data.user));
                } catch (error) {
                    console.error('Failed to load user:', error);
                    // logout(); // Don't logout immediately, maybe token just expired or network error
                }
            }
            setLoading(false);
        };

        loadUser();

        // Listen for Supabase auth state changes (e.g. after OAuth redirect)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Sync with our local state and backend
                // Ideally backend verifies the token, but for now we trust the session
                // We might need to ensure a profile exists in our DB, which usually happens via trigger or manually
                // Since we don't have triggers, we might need a backend call to 'sync-profile'

                // However, for this MVP, we assume the token is good.
                // We can call /auth/me to verify and get extended profile

                localStorage.setItem('token', session.access_token);
                setToken(session.access_token);

                try {
                    const response = await api.get('/auth/me'); // This verifies the token with backend
                    setUser(normalizeUser(response.data.user));
                } catch (e) {
                    // Profile might not exist if user just signed up via OAuth
                    // We might need to create it?
                    console.log('OAuth user detected, syncing profile...');
                    // If /auth/me fails, it implies backend doesn't know this user nicely, 
                    // OR the token style is different.
                    // Supabase tokens ARE JWTs so they should work if secret is same.
                }
            } else if (event === 'SIGNED_OUT') {
                logout();
            }
        });

        return () => subscription.unsubscribe();
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(normalizeUser(newUser));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // Optional: Call backend logout endpoint
    };

    const updateUser = (updatedUser: User) => {
        setUser(normalizeUser(updatedUser));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            updateUser,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
