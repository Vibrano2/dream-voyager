import express, { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import supabase from '../config/supabase.js';

const router = express.Router();

/**
 * GET /api/packages
 * Get all available packages (public)
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, featured } = req.query;

        let query = supabase
            .from('packages')
            .select('*')
            .eq('available', true);

        if (category) {
            query = query.eq('category', category);
        }

        if (featured === 'true') {
            query = query.eq('featured', true);
        }

        const { data: packages, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch packages error:', error);
            return res.status(500).json({ error: 'Failed to fetch packages' });
        }

        res.status(200).json({ packages });
    } catch (error: any) {
        console.error('Get packages error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/packages/:id
 * Get a single package by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data: package_data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !package_data) {
            return res.status(404).json({ error: 'Package not found' });
        }

        res.status(200).json({ package: package_data });
    } catch (error: any) {
        console.error('Get package error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/packages
 * Create a new package (admin only)
 */
router.post('/', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
        const packageData = req.body;

        const { data: newPackage, error } = await supabase
            .from('packages')
            .insert([packageData])
            .select()
            .single();

        if (error) {
            console.error('Create package error:', error);
            return res.status(500).json({ error: 'Failed to create package' });
        }

        res.status(201).json({ package: newPackage, message: 'Package created successfully' });
    } catch (error: any) {
        console.error('Create package error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/packages/:id
 * Update a package (admin only)
 */
router.put('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data: updatedPackage, error } = await supabase
            .from('packages')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Update package error:', error);
            return res.status(500).json({ error: 'Failed to update package' });
        }

        res.status(200).json({ package: updatedPackage, message: 'Package updated successfully' });
    } catch (error: any) {
        console.error('Update package error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/packages/:id
 * Delete a package (admin only)
 */
router.delete('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('packages')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete package error:', error);
            return res.status(500).json({ error: 'Failed to delete package' });
        }

        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error: any) {
        console.error('Delete package error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
