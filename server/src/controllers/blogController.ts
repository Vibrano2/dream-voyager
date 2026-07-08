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

        // If no real API key is provided, return a highly realistic mock blog post!
        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            console.log('Using Mock AI Blog Generator because no real OPENAI_API_KEY was found.');
            
            // Simulate a brief AI "thinking" delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Array of beautiful high-quality travel images for variety
            const mockImages = [
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80'
            ];
            const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
            
            // Format the title nicely
            const formattedTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
            
            return res.status(200).json({
                blog: {
                    title: formattedTitle.length > 50 ? formattedTitle : `Guide to ${formattedTitle}`,
                    content: `Here is your comprehensive guide to exploring the beauty of ${topic}. Whether you are seeking adventure, relaxation, or cultural immersion, this destination offers an unforgettable experience.

There is nothing quite like exploring ${topic}. From its stunning landscapes to its vibrant local culture, it is a destination that captivates every traveler. In this guide, we will explore everything you need to know to make the most of your journey.

When visiting ${topic}, you absolutely cannot miss the incredible highlights. You can capture the perfect photo at the most famous iconic landmarks, step off the beaten path to discover local secrets, and experience panoramic vistas that will leave you speechless.

A trip to ${topic} isn't complete without indulging in the local flavors. The culinary scene is a perfect blend of traditional recipes and modern gastronomy. Be sure to try the local street food, as well as the fine dining establishments that source fresh, regional ingredients.

If you are planning your trip, the shoulder seasons offer great weather and fewer crowds. Local transit is reliable, but renting a car gives you the most freedom. Be sure to pack light, breathable clothing and comfortable walking shoes.

${topic} is more than just a destination; it is an experience that will stay with you forever. Book your Dream Voyager package today and experience the world in absolute luxury!`,
                    tags: ['travel', 'guide', 'luxury', 'vacation'],
                    image_url: randomImage
                }
            });
        }

        const openai = new OpenAI({ apiKey });

        const prompt = `
You are an expert travel blogger for Dream Voyager, a luxury travel agency.
Generate a comprehensive, engaging, and SEO-friendly travel blog post about the following topic: "${topic}"

Your response MUST be a valid JSON object with the following structure:
{
    "title": "A catchy, SEO-friendly title for the blog post",
    "content": "The full blog post content formatted as simple, plain text paragraphs separated by newlines. DO NOT use any Markdown formatting like **, ##, or bullet points. Just use standard text and line breaks.",
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
        
        let imageUrl = '';
        try {
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: `A highly realistic, beautiful, wide-aspect photography shot of ${generatedData.imageKeyword || topic}. High quality travel photography style, 4k.`,
                n: 1,
                size: "1024x1024",
            });
            imageUrl = imageResponse.data?.[0]?.url || '';
        } catch (imgError) {
            console.error('DALL-E image generation error:', imgError);
            // Fallback if DALL-E fails
            imageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80';
        }

        generatedData.image_url = imageUrl;

        res.status(200).json({ blog: generatedData });

    } catch (error: any) {
        console.error('AI Blog Generation error:', error);
        res.status(500).json({ error: 'Failed to generate blog post' });
    }
};
