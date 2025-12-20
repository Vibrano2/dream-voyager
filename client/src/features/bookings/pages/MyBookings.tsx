import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Eye, XCircle, Download } from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../auth/context/AuthContext';

interface Booking {
    id: string;
    booking_reference: string;
    travel_date: string;
    passengers: number;
    total_amount: number;
    status: string;
    created_at: string;
    packages: {
        title: string;
        location: string;
        image_url?: string;
    };
}

const MyBookings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            alert('Failed to cancel booking');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
            case 'CONFIRMED':
                return 'bg-green-100 text-green-700';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter.toUpperCase();
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">My Bookings</h1>
                    <p className="text-slate-600">View and manage all your travel bookings</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {['all', 'pending', 'paid', 'confirmed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-slate-400" size={48} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No bookings found</h3>
                        <p className="text-slate-600 mb-6">
                            {filter === 'all'
                                ? "You haven't made any bookings yet"
                                : `No ${filter} bookings found`
                            }
                        </p>
                        <button
                            onClick={() => navigate('/packages')}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
                        >
                            Browse Packages
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                        {booking.packages.image_url ? (
                                            <img
                                                src={booking.packages.image_url}
                                                alt={booking.packages.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-6xl">🏖️</span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                                                    {booking.packages.title}
                                                </h3>
                                                <p className="text-slate-600 flex items-center gap-1">
                                                    <MapPin size={16} />
                                                    {booking.packages.location}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-slate-500">Booking Reference</p>
                                                <p className="font-semibold text-slate-800">{booking.booking_reference}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Travel Date</p>
                                                <p className="font-medium text-slate-700">
                                                    {new Date(booking.travel_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Travelers</p>
                                                <p className="font-medium text-slate-700 flex items-center gap-1">
                                                    <Users size={14} />
                                                    {booking.passengers}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Total Amount</p>
                                                <p className="font-bold text-blue-600">₦{booking.total_amount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/booking/${booking.id}`)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>

                                            {booking.status === 'PENDING' && (
                                                <button
                                                    onClick={() => navigate(`/payment/${booking.id}`)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                >
                                                    Pay Now
                                                </button>
                                            )}

                                            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <XCircle size={16} />
                                                    Cancel
                                                </button>
                                            )}

                                            {booking.status === 'PAID' && (
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                                                >
                                                    <Download size={16} />
                                                    Download Receipt
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
