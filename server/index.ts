import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bookingsRouter from './routes/bookings.js';
import paymentsRouter from './routes/payments.js';
import packagesRouter from './routes/packages.js';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import { deliveriesRouter } from './routes/deliveries.js';
import { adminRouter } from './routes/admin.js';
import { requireAuth, requireRole } from './middleware/auth.js';

import path from 'path';

dotenv.config();
// Also try to load from client/.env in case the user put the key there
dotenv.config({ path: path.join(process.cwd(), '../client/.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://dream-voyager.vercel.app',
            'https://dreamvoyagerg.com',
            'https://www.dreamvoyagerg.com',
            process.env.CLIENT_URL
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            // Check if origin matches Vercel preview deployments
            if (origin.endsWith('.vercel.app')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true
}));
app.use(express.json());

// DDoS / Bot Protection: Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Dream Voyager API is secure and running' });
});

// Example protected route for testing
app.get('/api/admin-dashboard', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Admin Dashboard' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Server updated: CORS Config v1.2');
});
