import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { initializePayment, verifyPayment, generatePaymentReference, ngnToKobo } from '../services/paystack.js';
import supabase from '../config/supabase.js';

const router = express.Router();

/**
 * POST /api/payments/initialize
 * Initialize a payment for a booking
 */
router.post('/initialize', requireAuth, async (req: Request, res: Response) => {
    try {
        const { booking_id, amount } = req.body;

        if (!booking_id || !amount) {
            return res.status(400).json({ error: 'booking_id and amount are required' });
        }

        // Verify booking exists and belongs to user
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', booking_id)
            .eq('user_id', req.user!.id)
            .single();

        if (bookingError || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Generate payment reference
        const paymentReference = generatePaymentReference();

        // Initialize Paystack payment
        const paystackResponse = await initializePayment({
            email: req.user!.email,
            amount: ngnToKobo(amount),
            reference: paymentReference,
            metadata: {
                booking_id,
                user_id: req.user!.id,
                booking_reference: booking.booking_reference
            }
        });

        // Create payment record in database
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .insert([{
                booking_id,
                user_id: req.user!.id,
                amount,
                payment_reference: paymentReference,
                paystack_reference: paystackResponse.data.reference,
                status: 'PENDING'
            }])
            .select()
            .single();

        if (paymentError) {
            console.error('Payment record creation error:', paymentError);
            return res.status(500).json({ error: 'Failed to create payment record' });
        }

        res.status(200).json({
            message: 'Payment initialized successfully',
            payment_url: paystackResponse.data.authorization_url,
            reference: paymentReference,
            payment
        });
    } catch (error: any) {
        console.error('Payment initialization error:', error);
        res.status(500).json({ error: error.message || 'Payment initialization failed' });
    }
});

/**
 * GET /api/payments/verify/:reference
 * Verify a payment transaction
 */
router.get('/verify/:reference', requireAuth, async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;

        // Verify with Paystack
        const paystackResponse = await verifyPayment(reference);

        if (!paystackResponse.status) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        const paymentData = paystackResponse.data;

        // Update payment record
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .update({
                status: paymentData.status === 'success' ? 'SUCCESS' : 'FAILED',
                metadata: paymentData
            })
            .eq('payment_reference', reference)
            .select()
            .single();

        if (paymentError) {
            console.error('Payment update error:', paymentError);
            return res.status(500).json({ error: 'Failed to update payment status' });
        }

        // If payment successful, update booking status
        if (paymentData.status === 'success') {
            await supabase
                .from('bookings')
                .update({ status: 'PAID' })
                .eq('id', payment.booking_id);
        }

        res.status(200).json({
            message: 'Payment verified successfully',
            status: paymentData.status,
            payment
        });
    } catch (error: any) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: error.message || 'Payment verification failed' });
    }
});

/**
 * POST /api/payments/webhook
 * Handle Paystack webhook events
 */
router.post('/webhook', async (req: Request, res: Response) => {
    try {
        const event = req.body;

        // Verify webhook signature (important for production)
        const crypto = await import('crypto');
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        if (event.event === 'charge.success') {
            const { reference, status } = event.data;

            // Update payment status
            const { data: payment } = await supabase
                .from('payments')
                .update({
                    status: 'SUCCESS',
                    metadata: event.data
                })
                .eq('paystack_reference', reference)
                .select()
                .single();

            if (payment) {
                // Update booking status
                await supabase
                    .from('bookings')
                    .update({ status: 'PAID' })
                    .eq('id', payment.booking_id);

                // TODO: Send confirmation email
            }
        }

        res.status(200).json({ message: 'Webhook received' });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

/**
 * GET /api/payments/user
 * Get all payments for the logged-in user
 */
router.get('/user', requireAuth, async (req: Request, res: Response) => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select('*, bookings(*)')
            .eq('user_id', req.user!.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch payments error:', error);
            return res.status(500).json({ error: 'Failed to fetch payments' });
        }

        res.status(200).json({ payments });
    } catch (error: any) {
        console.error('Get payments error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
