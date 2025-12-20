import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import supabase from '../config/supabase.js';

// Extend Express Request interface to include user and role
declare global {
    namespace Express {
        interface Request {
            user?: any;
            role?: string;
        }
    }
}

// Middleware to check if user is authenticated
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
};

// Middleware to check specific roles
export const requireRole = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // STRICT SECURITY: Always verify against the database.
        // We Use a User-Scoped Client to ensure we are acting AS the user (RLS compatible).
        // This avoids issues if the Server Service Key is missing/invalid.
        const token = req.headers.authorization?.split(' ')[1];
        const userClient = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: profile, error } = await userClient
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (error || !profile) {
            console.error('[Auth Middleware] Profile lookup failed:', error);
            return res.status(403).json({ error: 'Access denied: Profile not found' });
        }

        const userRole = profile.role || 'customer';

        if (!allowedRoles.includes(userRole)) {
            console.warn(`[Auth Middleware] Access denied. User ${req.user.id} has role '${userRole}', required: ${allowedRoles.join(', ')}`);
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        // Attach verified role to request
        req.role = userRole;
        next();
    };
};
