import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Middleware to ensure all routes here are admin-only
router.use(requireAuth, requireRole(['admin']));

// GET /api/admin/stats - Dashboard overview metrics
router.get('/stats', async (req, res) => {
    try {
        const { count: bookingsCount, error: bookingsError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });

        const { count: usersCount, error: usersError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const { count: packagesCount, error: packagesError } = await supabase
            .from('packages')
            .select('*', { count: 'exact', head: true });

        // Calculate total revenue (sum of payments with status 'success')
        const { data: payments, error: paymentsError } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'success');

        if (bookingsError || usersError || packagesError || paymentsError) {
            throw new Error('Error fetching stats');
        }

        const totalRevenue = payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

        res.json({
            stats: {
                totalBookings: bookingsCount || 0,
                totalUsers: usersCount || 0,
                activePackages: packagesCount || 0,
                totalRevenue
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/bookings - List all bookings
router.get('/bookings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                profiles:user_id (full_name, email),
                packages:package_id (title)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/bookings/:id - Update booking status
router.put('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/users/:id - Update user role
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['admin', 'customer', 'agent'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Update profile role
        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Also try to update auth.users metadata if the service key has permission (usually yes)
        try {
            await supabase.auth.admin.updateUserById(id, {
                user_metadata: { role }
            });
        } catch (authError) {
            console.warn('Failed to update auth.users metadata:', authError);
            // Don't fail the request if just metadata update fails, as profile is source of truth for our API
        }

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/settings - Get global settings
router.get('/settings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (error) throw error;
        console.log('GET /settings found row:', data);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/settings - Update global settings
router.put('/settings', async (req, res) => {
    try {
        // We assume ID is always 1 (constraint in DB)
        const updates = req.body;

        // Remove id if present to allow update
        delete updates.id;
        delete updates.created_at;
        delete updates.updated_at;

        const { data, error } = await supabase
            .from('settings')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', 1)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export const adminRouter = router;
