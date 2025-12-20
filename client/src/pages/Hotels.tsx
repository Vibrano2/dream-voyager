import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Users, MapPin, ArrowRight, Search, Star, Wifi, Coffee, Dumbbell, Check, X, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../features/auth/context/AuthContext';

interface Hotel {
    id: number;
    name: string;
    image: string;
    location: string;
    rating: number;
    reviews: number;
    price: string;
    priceNumeric: number;
    amenities: string[];
    description: string;
}

const sampleHotels: Hotel[] = [
    {
        id: 1,
        name: "The Grand Luxury Hotel",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
        location: "Victoria Island, Lagos",
        rating: 4.8,
        reviews: 342,
        price: "₦85,000",
        priceNumeric: 85000,
        amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Spa"],
        description: "Luxury 5-star hotel with stunning ocean views and world-class amenities"
    },
    {
        id: 2,
        name: "Seaside Resort & Spa",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
        location: "Lekki Phase 1, Lagos",
        rating: 4.6,
        reviews: 218,
        price: "₦65,000",
        priceNumeric: 65000,
        amenities: ["Free WiFi", "Beach Access", "Pool", "Restaurant"],
        description: "Beachfront resort perfect for relaxation and family getaways"
    },
    {
        id: 3,
        name: "Business Executive Suites",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
        location: "Ikeja GRA, Lagos",
        rating: 4.5,
        reviews: 156,
        price: "₦45,000",
        priceNumeric: 45000,
        amenities: ["Free WiFi", "Business Center", "Gym", "Restaurant"],
        description: "Modern hotel designed for business travelers with excellent connectivity"
    }
];

const Hotels = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [searchParams, setSearchParams] = useState({
        location: '',
        checkIn: '',
        checkOut: '',
        guests: 2,
        rooms: 1
    });

    const [showResults, setShowResults] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        fullName: '',
        email: '',
        phone: '',
        roomsRequested: 1,
        specialRequests: ''
    });
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(true);
    };

    const handleBookHotel = (hotel: Hotel) => {
        if (!isAuthenticated) {
            alert('Please login to book a hotel');
            navigate('/login');
            return;
        }
        setSelectedHotel(hotel);
        setBookingData({
            ...bookingData,
            roomsRequested: searchParams.rooms,
            email: user?.email || '',
            fullName: user?.full_name || ''
        });
        setShowBookingModal(true);
    };

    const calculateNights = () => {
        if (!searchParams.checkIn || !searchParams.checkOut) return 1;
        const checkIn = new Date(searchParams.checkIn);
        const checkOut = new Date(searchParams.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 1;
    };

    const calculateTotal = () => {
        if (!selectedHotel) return 0;
        return selectedHotel.priceNumeric * bookingData.roomsRequested * calculateNights();
    };

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setBookingError('');

        try {
            if (!selectedHotel) return;

            const response = await api.post('/bookings', {
                package_id: null,
                passengers: searchParams.guests,
                travel_date: searchParams.checkIn,
                passenger_details: [{
                    name: bookingData.fullName,
                    age: 0,
                    passport: ''
                }],
                special_requests: `Hotel: ${selectedHotel.name} | ${selectedHotel.location} | ${bookingData.roomsRequested} room(s) | ${calculateNights()} night(s) | Check-in: ${searchParams.checkIn} | Check-out: ${searchParams.checkOut} | ${bookingData.specialRequests}`,
                contact_email: bookingData.email,
                contact_phone: bookingData.phone,
                custom_price: calculateTotal(),
                booking_type: 'hotel'
            });

            if (response.data.success) {
                setBookingConfirmed(true);
                setTimeout(() => {
                    navigate(`/payment/${response.data.booking.id}`);
                }, 2000);
            }
        } catch (error: any) {
            setBookingError(error.response?.data?.error || 'Failed to create booking. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920"
                        alt="Hotel"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8] rounded-full filter blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F49129] rounded-full filter blur-[120px] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Building2 size={20} className="text-[#F49129]" />
                            <span className="font-semibold">Hotel Reservations</span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                            Book Your Perfect Stay
                        </h1>
                        <p className="text-lg text-slate-300">
                            From luxury resorts to budget-friendly hotels. Find the perfect accommodation for your trip.
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <form onSubmit={handleSearch}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                                {/* Location */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-semibold mb-2 text-white/90">Location</label>
                                    <div className="relative">
                                        <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Where are you going?"
                                            value={searchParams.location}
                                            onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Check-in */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/90">Check-in</label>
                                    <div className="relative">
                                        <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="date"
                                            value={searchParams.checkIn}
                                            onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Check-out */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/90">Check-out</label>
                                    <div className="relative">
                                        <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="date"
                                            value={searchParams.checkOut}
                                            onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Guests */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/90">Guests</label>
                                    <div className="relative">
                                        <Users size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select
                                            value={searchParams.guests}
                                            onChange={(e) => setSearchParams({ ...searchParams, guests: parseInt(e.target.value) })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium appearance-none"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-accent text-lg py-4 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
                            >
                                <Search size={22} />
                                Search Hotels
                                <ArrowRight size={22} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {showResults && (
                <div className="container mx-auto px-4 py-16">
                    <div className="mb-8">
                        <h2 className="font-heading text-3xl font-bold mb-2">Available Hotels</h2>
                        <p className="text-slate-600">Found {sampleHotels.length} hotels in {searchParams.location || 'your area'}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {sampleHotels.map((hotel) => (
                            <div key={hotel.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                        <Star size={16} className="text-[#F49129] fill-current" />
                                        <span className="font-bold text-slate-900">{hotel.rating}</span>
                                        <span className="text-slate-500 text-sm">({hotel.reviews})</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-[#F49129] transition-colors">
                                                {hotel.name}
                                            </h3>
                                            <p className="text-slate-600 flex items-center gap-2">
                                                <MapPin size={16} className="text-[#F49129]" />
                                                {hotel.location}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mb-4 line-clamp-2">
                                        {hotel.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                                            <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                                                <Check size={12} className="text-green-500" />
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Per night from</p>
                                            <p className="text-3xl font-bold text-slate-900">{hotel.price}</p>
                                        </div>
                                        <button
                                            onClick={() => handleBookHotel(hotel)}
                                            className="btn-accent px-6 py-3 flex items-center gap-2"
                                        >
                                            Reserve Now
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features Section */}
            {!showResults && (
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Book Hotels With Us?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We partner with thousands of hotels worldwide to offer you the best rates and service
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Star size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Best Rates</h3>
                            <p className="text-sm text-slate-600">Exclusive discounts and deals</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#F49129] to-[#d67a1f] rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Wifi size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Free Amenities</h3>
                            <p className="text-sm text-slate-600">WiFi, breakfast & more</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Check size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Free Cancellation</h3>
                            <p className="text-sm text-slate-600">On most bookings</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Building2 size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Verified Hotels</h3>
                            <p className="text-sm text-slate-600">Quality guaranteed</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedHotel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {!bookingConfirmed ? (
                            <>
                                <div className="bg-gradient-to-r from-[#F49129] to-[#d67a1f] text-white p-6 rounded-t-3xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="font-heading text-2xl font-bold mb-2">Complete Your Reservation</h2>
                                            <p className="text-white/90">{selectedHotel.name}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowBookingModal(false)}
                                            className="text-white/80 hover:text-white transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                            <p className="text-white/80 mb-1">Check-in</p>
                                            <p className="font-semibold">{searchParams.checkIn || 'Not set'}</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                            <p className="text-white/80 mb-1">Check-out</p>
                                            <p className="font-semibold">{searchParams.checkOut || 'Not set'}</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                            <p className="text-white/80 mb-1">Nights</p>
                                            <p className="font-semibold">{calculateNights()}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleConfirmBooking} className="p-6">
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={bookingData.fullName}
                                                onChange={(e) => setBookingData({ ...bookingData, fullName: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129]"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700">Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={bookingData.email}
                                                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129]"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={bookingData.phone}
                                                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129]"
                                                    placeholder="+234 800 000 0000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">Number of Rooms *</label>
                                            <select
                                                value={bookingData.roomsRequested}
                                                onChange={(e) => setBookingData({ ...bookingData, roomsRequested: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] appearance-none"
                                            >
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">Special Requests (Optional)</label>
                                            <textarea
                                                value={bookingData.specialRequests}
                                                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] resize-none"
                                                placeholder="Early check-in, extra towels, etc."
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                                        <h3 className="font-bold text-lg mb-4">Price Summary</h3>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-slate-600">
                                                <span>{selectedHotel.price} × {calculateNights()} night(s) × {bookingData.roomsRequested} room(s)</span>
                                                <span>₦{calculateTotal().toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-lg">Total</span>
                                                <span className="font-bold text-2xl text-[#F49129]">
                                                    ₦{calculateTotal().toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {bookingError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                                            <AlertCircle size={20} />
                                            {bookingError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full btn-accent text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Confirm Reservation
                                                <CheckCircle2 size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                    <CheckCircle2 size={40} className="text-green-600" />
                                </div>
                                <h2 className="font-heading text-3xl font-bold mb-4 text-green-600">Reservation Created!</h2>
                                <p className="text-slate-600 mb-2">Redirecting to payment...</p>
                                <p className="text-sm text-slate-500">Please wait while we process your request</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotels;
