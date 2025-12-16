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

export const adminRouter = router;
