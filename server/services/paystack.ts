import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface InitializePaymentParams {
    email: string;
    amount: number; // in kobo (NGN smallest unit)
    reference?: string;
    callback_url?: string;
    metadata?: Record<string, any>;
}

interface PaystackResponse {
    status: boolean;
    message: string;
    data: any;
}

/**
 * Initialize a Paystack payment transaction
 */
export const initializePayment = async (params: InitializePaymentParams): Promise<PaystackResponse> => {
    try {
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email: params.email,
                amount: params.amount,
                reference: params.reference,
                callback_url: params.callback_url || `${process.env.CLIENT_URL}/payment/callback`,
                metadata: params.metadata || {}
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error: any) {
        console.error('Paystack initialization error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Payment initialization failed');
    }
};

/**
 * Verify a Paystack payment transaction
 */
export const verifyPayment = async (reference: string): Promise<PaystackResponse> => {
    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        return response.data;
    } catch (error: any) {
        console.error('Paystack verification error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
};

/**
 * Generate a unique payment reference
 */
export const generatePaymentReference = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `DV-PAY-${timestamp}-${random}`;
};

/**
 * Convert NGN to kobo (Paystack uses kobo)
 */
export const ngnToKobo = (amount: number): number => {
    return Math.round(amount * 100);
};

/**
 * Convert kobo to NGN
 */
export const koboToNgn = (amount: number): number => {
    return amount / 100;
};
