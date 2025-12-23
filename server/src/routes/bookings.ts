import express, { Request, Response } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { sendBookingConfirmation } from '../services/emailService.js';
import { initializePayment, generatePaymentReference, ngnToKobo } from '../services/paystack.js';

const router = express.Router();

// Helper function to generate booking reference
const generateBookingReference = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 999999);
    return `DV-${String(random).padStart(6, '0')}`;
};

// GET /api/bookings - Get all bookings for the logged in user (or all if admin)
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        let query = supabase
            .from('bookings')
            .select(`
                *,
                packages (
                    id,
                    title,
                    description,
                    location,
                    price,
                    image_url,
                    category
                ),
                profiles (
                    id,
                    full_name,
                    email,
                    phone
                )
            `)
            .order('created_at', { ascending: false });

        // If not admin, only show own bookings
        if (req.role !== 'admin') {
            query = query.eq('user_id', req.user.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bookings/:id - Get specific booking details
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                packages (
                    id,
                    title,
                    description,
                    location,
                    duration,
                    price,
                    image_url,
                    category,
                    inclusions,
                    exclusions
                ),
                profiles (
                    id,
                    full_name,
                    email,
                    phone
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Check if user owns this booking (unless admin)
        if (req.role !== 'admin' && data.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/bookings - Create a new booking
router.post('/', requireAuth, async (req: Request, res: Response) => {
    const {
        package_id,
        passengers,
        travel_date,
        passenger_details,
        special_requests,
        contact_email,
        contact_phone,
        custom_price, // For flights or custom bookings
        booking_type = 'package' // 'package' or 'flight' or 'custom'
    } = req.body;

    try {
        let basePrice = 0;
        let totalAmount = 0;

        // 1. Validate package if package_id is provided
        if (package_id) {
            const { data: packageData, error: packageError } = await supabase
                .from('packages')
                .select('*')
                .eq('id', package_id)
                .single();

            if (packageError || !packageData) {
                return res.status(404).json({ error: 'Package not found' });
            }

            if (!packageData.available) {
                return res.status(400).json({ error: 'Package is not available' });
            }

            basePrice = packageData.price;
            totalAmount = basePrice * (passengers || 1);
        } else if (custom_price || booking_type === 'consultation') {
            // For flights or custom bookings without a package, or free consultations
            basePrice = custom_price || 0;
            totalAmount = basePrice * (passengers || 1);
        } else {
            return res.status(400).json({ error: 'Either package_id or custom_price is required' });
        }

        // 3. Generate unique booking reference
        let bookingReference = generateBookingReference();

        // Ensure uniqueness
        let { data: existingBooking } = await supabase
            .from('bookings')
            .select('booking_reference')
            .eq('booking_reference', bookingReference)
            .single();

        while (existingBooking) {
            bookingReference = generateBookingReference();
            const check = await supabase
                .from('bookings')
                .select('booking_reference')
                .eq('booking_reference', bookingReference)
                .single();
            existingBooking = check.data;
        }

        // 4. Create Booking in DB
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([
                {
                    booking_reference: bookingReference,
                    user_id: req.user.id,
                    package_id: package_id || null,
                    passengers: passengers || 1,
                    travel_date,
                    total_amount: totalAmount,
                    currency: 'NGN',
                    status: 'PENDING',
                    passenger_details: passenger_details || [],
                    special_requests: special_requests || null,
                    contact_email,
                    contact_phone,
                    booking_type // Insert booking type
                }
            ])
            .select(`
                *,
                packages (
                    id,
                    title,
                    description,
                    location,
                    price,
                    image_url
                )
            `)
            .single();

        if (bookingError) throw bookingError;

        // 5. Send confirmation email
        const emailData = {
            id: booking.id,
            booking_reference: booking.booking_reference,
            package_title: booking.packages?.title || `${booking_type.charAt(0).toUpperCase() + booking_type.slice(1)} Booking`,
            travel_date: booking.travel_date,
            passengers: booking.passengers,
            total_amount: booking.total_amount
        };

        await sendBookingConfirmation(
            contact_email || req.user.email,
            emailData
        );

        res.status(201).json({
            success: true,
            booking,
            message: 'Booking created successfully. Confirmation email sent.'
        });
    } catch (error: any) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/bookings/:id - Update booking (admin or owner)
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Get existing booking
        const { data: existingBooking, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check permissions
        if (req.role !== 'admin' && existingBooking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update booking
        const { data, error } = await supabase
            .from('bookings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            booking: data,
            message: 'Booking updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Get existing booking
        const { data: existingBooking, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check permissions
        if (req.role !== 'admin' && existingBooking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update status to CANCELLED instead of deleting
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'CANCELLED' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            booking: data
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/bookings/:id/payment - Initialize payment for booking
router.post('/:id/payment', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Get booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`
                *,
                packages (
                    title
                )
            `)
            .eq('id', id)
            .single();

        if (bookingError || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if user owns this booking
        if (booking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if already paid
        if (booking.status === 'PAID') {
            return res.status(400).json({ error: 'Booking already paid' });
        }

        // Generate payment reference
        const paymentReference = generatePaymentReference();

        // Initialize Paystack payment
        const paymentData = await initializePayment({
            email: req.user.email,
            amount: ngnToKobo(booking.total_amount),
            reference: paymentReference,
            callback_url: `${process.env.CLIENT_URL}/booking/confirm/${id}`,
            metadata: {
                booking_id: booking.id,
                booking_reference: booking.booking_reference,
                package_title: booking.packages?.title,
                user_id: req.user.id
            }
        });

        // Store payment record
        await supabase.from('payments').insert([
            {
                booking_id: booking.id,
                user_id: req.user.id,
                amount: booking.total_amount,
                currency: 'NGN',
                payment_method: 'paystack',
                payment_reference: paymentReference,
                paystack_reference: paymentData.data.reference,
                status: 'PENDING',
                metadata: {
                    authorization_url: paymentData.data.authorization_url,
                    access_code: paymentData.data.access_code
                }
            }
        ]);

        res.json({
            success: true,
            payment: {
                reference: paymentReference,
                authorization_url: paymentData.data.authorization_url,
                access_code: paymentData.data.access_code
            }
        });
    } catch (error: any) {
        console.error('Payment initialization error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
