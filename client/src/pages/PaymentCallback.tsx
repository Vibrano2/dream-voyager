import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying payment...');

    useEffect(() => {
        const reference = searchParams.get('reference');

        if (!reference) {
            setStatus('Invalid payment reference');
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await api.get(`/payments/verify/${reference}`);
                if (res.data.status === 'success') {
                    // Redirect to confirmation page with booking ID
                    const bookingId = res.data.payment.booking_id;
                    navigate(`/booking/confirm/${bookingId}`);
                } else {
                    setStatus('Payment failed or was not successful.');
                    setTimeout(() => navigate('/my-bookings'), 3000);
                }
            } catch (error) {
                console.error('Payment verification failed:', error);
                setStatus('Verification failed. Please check your bookings.');
                setTimeout(() => navigate('/my-bookings'), 3000);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-slate-800">{status}</h2>
                <p className="text-slate-500 mt-2">Please do not close this window.</p>
            </div>
        </div>
    );
};

export default PaymentCallback;
