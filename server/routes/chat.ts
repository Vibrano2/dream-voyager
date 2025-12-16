import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini
// Note: In production, ensure GOOGLE_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
        if (!process.env.GOOGLE_API_KEY) {
            console.warn('Google API Key not configured');
            // Mock response for dev/demo if key is missing
            return res.json({
                response: "I'm currently in demo mode as my AI brain hasn't been fully connected yet! Please contact support for immediate assistance."
            });
        }

        // Construct chat history for context if needed
        // For simple implementation, we'll just send the current message with system context
        // Advanced: maintain history buffer

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist Dream Voyager customers with luxury travel inquiries, visa assistance, and package details." }],
                },
                // Add previous chat history here if passed from client
                ...(history || []).map((msg: any) => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

export default router;
