import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BookingDetails {
    id: string;
    booking_reference: string;
    travel_date: string;
    passengers: number;
    total_amount: number;
    status: string;
    packages: {
        title: string;
        location: string;
        image_url?: string;
    };
}

const Payment = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookingDetails();
    }, [bookingId, user, navigate]);

    const fetchBookingDetails = async () => {
        try {
            const response = await api.get(`/bookings/${bookingId}`);
            setBooking(response.data);
        } catch (error) {
            console.error('Failed to fetch booking:', error);
            setError('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!booking) return;

        setProcessing(true);
        setError('');

        try {
            // Initialize payment
            const response = await api.post(`/bookings/${bookingId}/payment`);
            const { authorization_url } = response.data.payment;

            // Redirect to Paystack
            window.location.href = authorization_url;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Payment initialization failed');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Error</h2>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    if (!booking) return null;

    if (booking.status === 'PAID') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Already Paid</h2>
                    <p className="text-slate-600 mb-6">This booking has already been paid for.</p>
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
                        <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
                        <p className="text-blue-100">Booking Reference: {booking.booking_reference}</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        {/* Booking Summary */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Booking Summary</h2>
                            <div className="bg-slate-50 rounded-lg p-6">
                                <div className="flex gap-4 mb-4">
                                    {booking.packages.image_url && (
                                        <img
                                            src={booking.packages.image_url}
                                            alt={booking.packages.title}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">{booking.packages.title}</h3>
                                        <p className="text-slate-600">{booking.packages.location}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">Travel Date</p>
                                        <p className="font-medium text-slate-800">
                                            {new Date(booking.travel_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Travelers</p>
                                        <p className="font-medium text-slate-800">{booking.passengers} {booking.passengers === 1 ? 'Person' : 'People'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Amount */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Payment Details</h2>
                            <div className="bg-blue-50 rounded-lg p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-medium">₦{booking.total_amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-600">Service Fee</span>
                                    <span className="font-medium">₦0</span>
                                </div>
                                <div className="border-t border-blue-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-800">Total Amount</span>
                                        <span className="text-2xl font-bold text-blue-600">₦{booking.total_amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <Shield className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <div className="text-sm text-green-800">
                                <p className="font-semibold mb-1">Secure Payment</p>
                                <p>Your payment is processed securely through Paystack. We never store your card details.</p>
                            </div>
                        </div>

                        {/* Payment Button */}
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Pay ₦{booking.total_amount.toLocaleString()} with Paystack
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-4">
                            By proceeding, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
