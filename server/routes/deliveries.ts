import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get user's deliveries
router.get('/my-deliveries', requireAuth, async (req: any, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('deliveries')
            .select(`
                *,
                bookings (
                    booking_reference,
                    packages (title)
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// "Download" delivery (Generate signed URL or return direct link depending on storage)
// For this MVP, we'll just increment download count and return the URL
router.get('/download/:id', requireAuth, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Verify ownership
        const { data: delivery, error: fetchError } = await supabase
            .from('deliveries')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (fetchError || !delivery) {
            return res.status(404).json({ error: 'Delivery not found or access denied' });
        }

        // Increment download count
        await supabase
            .from('deliveries')
            .update({ download_count: delivery.download_count + 1 })
            .eq('id', id);

        // In a real app with private S3/Storage buckets, you'd generate a signed URL here.
        // For now, we return the stored URL.
        res.json({ downloadUrl: delivery.file_url });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export const deliveriesRouter = router;
