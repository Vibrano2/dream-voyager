import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import supabase from '../config/supabase.js';

// @desc    Get all available packages
export const getPackages = async (req: Request, res: Response) => {
    try {
        const { category, featured, show_hidden } = req.query;

        let query = supabase
            .from('packages')
            .select('*');

        // Only filter by availability if we are NOT asking to show hidden (Admin)
        if (show_hidden !== 'true') {
            query = query.eq('available', true);
        }

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
};

// @desc    Get a single package by ID
export const getPackageById = async (req: Request, res: Response) => {
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
};

// @desc    Create a new package (admin only)
export const createPackage = async (req: Request, res: Response) => {
    try {
        const packageData = req.body;

        // Default available to true if not provided
        if (packageData.available === undefined) {
            packageData.available = true;
        }

        // Map frontend 'destination' to database 'location'
        if (packageData.destination && !packageData.location) {
            packageData.location = packageData.destination;
            delete packageData.destination; // Optional: Remove if DB treats it as extra
        }

        console.log('[Create Package] Payload:', JSON.stringify(packageData, null, 2));

        // Use User Context for RLS (Fixes Service Key missing issue on Prod)
        // We create a new client that "acts as" the user making the request.
        const token = req.headers.authorization?.split(' ')[1];

        // Debugging Env Vars
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('[Create Package] CRITICAL: Missing Supabase Env Vars');
            console.error('URL:', supabaseUrl ? 'Present' : 'Missing');
            console.error('Key:', supabaseAnonKey ? 'Present' : 'Missing');
            // Check if key is too short (bad placeholder)
            if (supabaseAnonKey && supabaseAnonKey.length < 20) {
                console.error('Key looks like placeholder or invalid:', supabaseAnonKey);
            }
            return res.status(500).json({ error: 'Server misconfiguration: Missing API Keys' });
        }

        const userClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: newPackage, error } = await userClient
            .from('packages')
            .insert([packageData])
            .select()
            .single();

        if (error) {
            console.error('[Create Package Error] DB Error:', JSON.stringify(error, null, 2));
            return res.status(500).json({ error: `Failed to create package: ${error.message}` });
        }

        res.status(201).json({ package: newPackage, message: 'Package created successfully' });
    } catch (error: any) {
        console.error('Create package error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update a package (admin only)
export const updatePackage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Map frontend 'destination' to database 'location'
        if (updates.destination && !updates.location) {
            updates.location = updates.destination;
            delete updates.destination;
        }
        console.log(`[Update Package] ID: ${id}, Payload:`, JSON.stringify(updates, null, 2));

        // Use User Context for RLS
        const token = req.headers.authorization?.split(' ')[1];

        // Debugging Env Vars
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('[Update Package] CRITICAL: Missing Supabase Env Vars');
            return res.status(500).json({ error: 'Server misconfiguration: Missing API Keys' });
        }

        const userClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: updatedPackage, error } = await userClient
            .from('packages')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[Update Package Error] DB Error:', JSON.stringify(error, null, 2));
            return res.status(500).json({ error: `Failed to update package: ${error.message}` });
        }

        res.status(200).json({ package: updatedPackage, message: 'Package updated successfully' });
    } catch (error: any) {
        console.error('Update package error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete a package (admin only)
export const deletePackage = async (req: Request, res: Response) => {
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
};
