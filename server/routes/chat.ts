import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI
// Note: In production, ensure OPENAI_API_KEY is in your .env file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompt to give the AI context about Dream Voyager
const SYSTEM_PROMPT = `
You are the AI assistant for Dream Voyager, a premium travel agency specializing in luxury travel experiences.
Your role is to help customers find their perfect trip, answer questions about our packages, and provide visa assistance information.

Key Information about Dream Voyager:
- We offer luxury packages to Dubai, Europe, Africa, Asia, and Americas.
- We have a special "Study Visa Assist" program for students.
- We provide corporate travel solutions and honeymoon packages.
- Our brand values are: Premium, Reliable, and Personalized.
- Contact info: +234 800 DREAM VOY, hello@dreamvoyager.com

Guidelines:
- Be helpful, polite, and enthusiastic about travel.
- Keep responses concise and easy to read.
- If asked about prices, give a general range or refer them to specific packages on the site.
- If you don't know something, ask them to contact our support team.
- Do NOT make up fake flight schedules or specific visa guarantee promises.
`;

router.post('/', async (req: Request, res: Response) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check if API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OpenAI API Key not configured');
            // Mock response for dev/demo if key is missing
            return res.json({
                response: "I'm currently in demo mode as my AI brain hasn't been fully connected yet! Please contact support for immediate assistance."
            });
        }

        // Construct messages array for OpenAI
        const messages: any[] = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "assistant", content: "Understood. I am ready to assist Dream Voyager customers with luxury travel inquiries, visa assistance, and package details." },
            ...(history || []).map((msg: any) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant', // OpenAI uses 'assistant', client might send 'model' or 'ai'
                content: msg.text
            })),
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo", // or gpt-4
        });

        const text = completion.choices[0].message.content;

        res.json({ response: text });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

export default router;
