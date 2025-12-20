import { Request, Response, NextFunction } from 'express';
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

        // Check user_metadata first (avoids DB RLS recursion)
        const metadataRole = req.user.user_metadata?.role;
        if (metadataRole && allowedRoles.includes(metadataRole)) {
            req.role = metadataRole;
            return next();
        }

        // Fallback: Query profile table (only if metadata fails)
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (error || !profile) {
            return res.status(403).json({ error: 'Access denied: Profile not found' });
        }

        if (!allowedRoles.includes(profile.role)) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        req.role = profile.role;
        next();
    };
};
