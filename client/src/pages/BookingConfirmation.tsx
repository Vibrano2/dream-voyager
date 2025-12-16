import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, Calendar } from 'lucide-react';

const BookingConfirmation = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Confetti or celebration animation can be added here
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-green-100 rounded-full mb-4 animate-bounce">
                        <CheckCircle className="text-green-600" size={64} />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
                    <p className="text-lg text-slate-600">Your booking has been confirmed</p>
                </div>

                {/* Confirmation Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="text-center mb-6">
                        <p className="text-sm text-slate-500 mb-2">Booking Reference</p>
                        <p className="text-3xl font-bold text-blue-600 tracking-wider">
                            {bookingId ? `DV-${bookingId.slice(0, 6).toUpperCase()}` : 'Loading...'}
                        </p>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="font-semibold text-slate-800 mb-4">What's Next?</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 font-bold text-xs">1</span>
                                </div>
                                <p>A confirmation email has been sent to your registered email address with all booking details.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 font-bold text-xs">2</span>
                                </div>
                                <p>Our team will review your booking and send you the travel itinerary within 24 hours.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 font-bold text-xs">3</span>
                                </div>
                                <p>You can view and manage your booking anytime from "My Bookings" page.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Need Help?</strong> Contact our support team at support@dreamvoyager.com or call +234 800 DREAM VOY
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Calendar size={20} />
                        My Bookings
                    </button>
                    <button
                        onClick={() => {
                            // TODO: Implement download receipt
                            alert('Receipt download coming soon!');
                        }}
                        className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                        <Download size={20} />
                        Download Receipt
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                        <Home size={20} />
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
