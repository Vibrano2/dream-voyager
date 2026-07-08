import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import supabase from '../config/supabase.js';

// @desc    Get all published blogs (public) or all blogs (admin)
export const getBlogs = async (req: Request, res: Response) => {
    try {
        const { show_hidden } = req.query;

        let query = supabase.from('blogs').select('*');

        // If not requesting hidden (admin view), only show published blogs
        if (show_hidden !== 'true') {
            query = query.eq('published', true);
        }

        const { data: blogs, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch blogs error:', error);
            return res.status(500).json({ error: 'Failed to fetch blogs' });
        }

        res.status(200).json({ blogs });
    } catch (error: any) {
        console.error('Get blogs error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get a single blog by ID
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data: blog, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !blog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.status(200).json({ blog });
    } catch (error: any) {
        console.error('Get blog error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a new blog post (admin only)
export const createBlog = async (req: Request, res: Response) => {
    try {
        const blogData = req.body;

        // Default published to true if not provided
        if (blogData.published === undefined) {
            blogData.published = true;
        }

        const token = req.headers.authorization?.split(' ')[1];
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return res.status(500).json({ error: 'Server misconfiguration: Missing API Keys' });
        }

        const userClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: newBlog, error } = await userClient
            .from('blogs')
            .insert([blogData])
            .select()
            .single();

        if (error) {
            console.error('[Create Blog Error] DB Error:', JSON.stringify(error, null, 2));
            return res.status(500).json({ error: `Failed to create blog post: ${error.message}` });
        }

        res.status(201).json({ blog: newBlog, message: 'Blog post created successfully' });
    } catch (error: any) {
        console.error('Create blog error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update a blog post (admin only)
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const token = req.headers.authorization?.split(' ')[1];
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return res.status(500).json({ error: 'Server misconfiguration: Missing API Keys' });
        }

        const userClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        const { data: updatedBlog, error } = await userClient
            .from('blogs')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[Update Blog Error] DB Error:', JSON.stringify(error, null, 2));
            return res.status(500).json({ error: `Failed to update blog post: ${error.message}` });
        }

        res.status(200).json({ blog: updatedBlog, message: 'Blog post updated successfully' });
    } catch (error: any) {
        console.error('Update blog error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete a blog post (admin only)
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete blog error:', error);
            return res.status(500).json({ error: 'Failed to delete blog post' });
        }

        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error: any) {
        console.error('Delete blog error:', error);
        res.status(500).json({ error: error.message });
    }
};
