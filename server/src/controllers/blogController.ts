import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import supabase from '../config/supabase.js';
import OpenAI from 'openai';

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

// @desc    Generate a blog post using AI (admin only)
export const generateAIBlog = async (req: Request, res: Response) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_KEY || '';

        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API Key not configured' });
        }

        const openai = new OpenAI({ apiKey });

        const prompt = `
You are an expert travel blogger for Dream Voyager, a luxury travel agency.
Generate a comprehensive, engaging, and SEO-friendly travel blog post about the following topic: "${topic}"

Your response MUST be a valid JSON object with the following structure:
{
    "title": "A catchy, SEO-friendly title for the blog post",
    "content": "The full blog post content formatted beautifully in Markdown. Include headings, lists, and engaging paragraphs. Must be detailed and well-written.",
    "tags": ["travel", "luxury", "relevant-tag-1", "relevant-tag-2"],
    "imageKeyword": "A short search term (1-3 words) that would find a good cover image for this post on Unsplash (e.g., 'paris eiffel tower')"
}

Ensure the response is strict JSON. Do not include markdown code block wrappers (like \`\`\`json) around the response.
`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content;
        
        if (!text) {
            throw new Error('Failed to generate content');
        }

        const generatedData = JSON.parse(text);

        res.status(200).json({ blog: generatedData });

    } catch (error: any) {
        console.error('AI Blog Generation error:', error);
        res.status(500).json({ error: 'Failed to generate blog post' });
    }
};
