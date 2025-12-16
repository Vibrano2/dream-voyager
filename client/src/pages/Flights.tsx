import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, MapPin, ArrowRight, Search, Filter, Star, Clock, X, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Flight {
    id: number;
    airline: string;
    logo: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: string;
    priceNumeric: number;
    stops: number;
    class: string;
    availableSeats: number;
    flightNumber: string;
}

const sampleFlights: Flight[] = [
    {
        id: 1,
        airline: "Emirates",
        logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=100",
        departure: "Lagos (LOS)",
        arrival: "London (LHR)",
        departureTime: "10:30 AM",
        arrivalTime: "6:45 PM",
        duration: "7h 15m",
        price: "₦850,000",
        priceNumeric: 850000,
        stops: 0,
        class: "Economy",
        availableSeats: 12,
        flightNumber: "EK783"
    },
    {
        id: 2,
        airline: "British Airways",
        logo: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=100",
        departure: "Lagos (LOS)",
        arrival: "London (LHR)",
        departureTime: "2:15 PM",
        arrivalTime: "10:30 PM",
        duration: "7h 15m",
        price: "₦780,000",
        priceNumeric: 780000,
        stops: 0,
        class: "Economy",
        availableSeats: 8,
        flightNumber: "BA075"
    },
    {
        id: 3,
        airline: "Qatar Airways",
        logo: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=100",
        departure: "Lagos (LOS)",
        arrival: "London (LHR)",
        departureTime: "11:45 PM",
        arrivalTime: "2:30 PM +1",
        duration: "13h 45m",
        price: "₦720,000",
        priceNumeric: 720000,
        stops: 1,
        class: "Economy",
        availableSeats: 15,
        flightNumber: "QR521"
    }
];

const Flights = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [searchParams, setSearchParams] = useState({
        tripType: 'roundtrip',
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        passengers: 1,
        class: 'economy'
    });

    const [showResults, setShowResults] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        fullName: '',
        email: '',
        phone: '',
        seatsRequested: 1,
        specialRequests: ''
    });
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(true);
    };

    const handleBookFlight = (flight: Flight) => {
        if (!isAuthenticated) {
            alert('Please login to book a flight');
            navigate('/login');
            return;
        }
        setSelectedFlight(flight);
        setBookingData({
            ...bookingData,
            seatsRequested: searchParams.passengers,
            email: user?.email || '',
            fullName: user?.full_name || ''
        });
        setShowBookingModal(true);
    };

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setBookingError('');

        try {
            if (!selectedFlight) return;

            // Create booking via API
            const response = await api.post('/bookings', {
                package_id: null, // For flights, we don't have a package
                passengers: bookingData.seatsRequested,
                travel_date: searchParams.departDate,
                passenger_details: [{
                    name: bookingData.fullName,
                    age: 0, // Can be collected if needed
                    passport: ''
                }],
                special_requests: `Flight: ${selectedFlight.airline} ${selectedFlight.flightNumber} | ${selectedFlight.departure} → ${selectedFlight.arrival} | ${bookingData.specialRequests}`,
                contact_email: bookingData.email,
                contact_phone: bookingData.phone,
                custom_price: selectedFlight.priceNumeric * 1.1, // Include 10% tax
                booking_type: 'flight'
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

    const calculateTotal = () => {
        if (!selectedFlight) return 0;
        return selectedFlight.priceNumeric * bookingData.seatsRequested;
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1920"
                        alt="Flight"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8] rounded-full filter blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F49129] rounded-full filter blur-[120px] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Plane size={20} className="text-[#F49129]" />
                            <span className="font-semibold">Flight Bookings</span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                            Find Your Perfect Flight
                        </h1>
                        <p className="text-lg text-slate-300">
                            Search and compare flights from top airlines worldwide. Best prices guaranteed.
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <form onSubmit={handleSearch}>
                            {/* Trip Type Selector */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setSearchParams({ ...searchParams, tripType: 'roundtrip' })}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${searchParams.tripType === 'roundtrip'
                                        ? 'bg-white text-[#F49129] shadow-lg'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                >
                                    Round Trip
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchParams({ ...searchParams, tripType: 'oneway' })}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${searchParams.tripType === 'oneway'
                                        ? 'bg-white text-[#F49129] shadow-lg'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                >
                                    One Way
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {/* From */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold mb-2 text-white/90">From</label>
                                    <div className="relative">
                                        <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Lagos (LOS)"
                                            value={searchParams.from}
                                            onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* To */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold mb-2 text-white/90">To</label>
                                    <div className="relative">
                                        <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="London (LHR)"
                                            value={searchParams.to}
                                            onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Depart Date */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold mb-2 text-white/90">Depart</label>
                                    <div className="relative">
                                        <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="date"
                                            value={searchParams.departDate}
                                            onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Return Date - Only show for round trip */}
                                {searchParams.tripType === 'roundtrip' && (
                                    <div className="relative">
                                        <label className="block text-sm font-semibold mb-2 text-white/90">Return</label>
                                        <div className="relative">
                                            <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="date"
                                                value={searchParams.returnDate}
                                                onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Passengers */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold mb-2 text-white/90">Passengers</label>
                                    <div className="relative">
                                        <Users size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select
                                            value={searchParams.passengers}
                                            onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium appearance-none"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Class */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold mb-2 text-white/90">Class</label>
                                    <div className="relative">
                                        <Star size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select
                                            value={searchParams.class}
                                            onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] text-slate-900 font-medium appearance-none"
                                        >
                                            <option value="economy">Economy</option>
                                            <option value="premium">Premium Economy</option>
                                            <option value="business">Business</option>
                                            <option value="first">First Class</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-accent text-lg py-4 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
                            >
                                <Search size={22} />
                                Search Flights
                                <ArrowRight size={22} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {showResults && (
                <div className="container mx-auto px-4 py-16">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="font-heading text-3xl font-bold mb-2">Available Flights</h2>
                            <p className="text-slate-600">Found {sampleFlights.length} flights for your search</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:border-[#F49129] transition-colors font-semibold">
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>

                    <div className="space-y-6">
                        {sampleFlights.map((flight) => (
                            <div key={flight.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Airline Logo */}
                                    <div className="flex items-center gap-4 lg:w-48">
                                        <img src={flight.logo} alt={flight.airline} className="w-16 h-16 rounded-xl object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg">{flight.airline}</h3>
                                            <p className="text-sm text-slate-500">{flight.flightNumber}</p>
                                            <p className="text-xs text-slate-400">{flight.class}</p>
                                        </div>
                                    </div>

                                    {/* Flight Details */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                        <div className="text-center md:text-left">
                                            <p className="text-2xl font-bold">{flight.departureTime}</p>
                                            <p className="text-slate-600 font-medium">{flight.departure}</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <div className="h-px bg-slate-300 flex-1"></div>
                                                <Plane size={20} className="text-[#F49129]" />
                                                <div className="h-px bg-slate-300 flex-1"></div>
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium flex items-center justify-center gap-1">
                                                <Clock size={14} />
                                                {flight.duration}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                                            </p>
                                        </div>

                                        <div className="text-center md:text-right">
                                            <p className="text-2xl font-bold">{flight.arrivalTime}</p>
                                            <p className="text-slate-600 font-medium">{flight.arrival}</p>
                                        </div>
                                    </div>

                                    {/* Price & Book */}
                                    <div className="lg:w-48 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${flight.availableSeats <= 5 ? 'bg-red-100 text-red-700' :
                                            flight.availableSeats <= 10 ? 'bg-orange-100 text-orange-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            <Users size={12} />
                                            {flight.availableSeats} seats left
                                        </div>
                                        <p className="text-sm text-slate-500 mb-1">From</p>
                                        <p className="text-3xl font-bold text-slate-900 mb-3">{flight.price}</p>
                                        <button
                                            onClick={() => handleBookFlight(flight)}
                                            className="w-full btn-accent py-3 flex items-center justify-center gap-2"
                                        >
                                            Book Now
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedFlight && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {!bookingConfirmed ? (
                            <>
                                {/* Modal Header */}
                                <div className="bg-gradient-to-r from-[#F49129] to-[#d67a1f] text-white p-6 rounded-t-3xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="font-heading text-2xl font-bold mb-2">Complete Your Booking</h2>
                                            <p className="text-white/90">{selectedFlight.airline} - {selectedFlight.flightNumber}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowBookingModal(false)}
                                            className="text-white/80 hover:text-white transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                            <p className="text-white/80 mb-1">Route</p>
                                            <p className="font-semibold">{selectedFlight.departure} → {selectedFlight.arrival}</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                            <p className="text-white/80 mb-1">Departure</p>
                                            <p className="font-semibold">{selectedFlight.departureTime}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Form */}
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
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">Number of Seats *</label>
                                            <select
                                                value={bookingData.seatsRequested}
                                                onChange={(e) => setBookingData({ ...bookingData, seatsRequested: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] appearance-none"
                                            >
                                                {Array.from({ length: Math.min(selectedFlight.availableSeats, 8) }, (_, i) => i + 1).map(num => (
                                                    <option key={num} value={num}>{num} {num === 1 ? 'Seat' : 'Seats'}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-slate-500 mt-1">
                                                <AlertCircle size={12} className="inline mr-1" />
                                                {selectedFlight.availableSeats} seats available
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">Special Requests (Optional)</label>
                                            <textarea
                                                value={bookingData.specialRequests}
                                                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] resize-none"
                                                placeholder="Meal preferences, wheelchair assistance, etc."
                                            />
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                                        <h3 className="font-bold text-lg mb-4">Price Summary</h3>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-slate-600">
                                                <span>{bookingData.seatsRequested} × {selectedFlight.price}</span>
                                                <span>₦{(selectedFlight.priceNumeric * bookingData.seatsRequested).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Taxes & Fees</span>
                                                <span>₦{(calculateTotal() * 0.1).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-lg">Total</span>
                                                <span className="font-bold text-2xl text-[#F49129]">
                                                    ₦{(calculateTotal() * 1.1).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Message */}
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
                                                Confirm Booking
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
                                <h2 className="font-heading text-3xl font-bold mb-4 text-green-600">Booking Created!</h2>
                                <p className="text-slate-600 mb-2">Redirecting to payment...</p>
                                <p className="text-sm text-slate-500">Please wait while we process your request</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Features Section */}
            {!showResults && (
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Book With Us?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We partner with the world's leading airlines to bring you the best deals and service
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Star size={32} className="text-white" />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3">Best Price Guarantee</h3>
                            <p className="text-slate-600">Find a lower price? We'll match it and give you an extra 5% off</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#F49129] to-[#d67a1f] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock size={32} className="text-white" />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3">24/7 Support</h3>
                            <p className="text-slate-600">Our travel experts are available round the clock to assist you</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Plane size={32} className="text-white" />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3">Flexible Booking</h3>
                            <p className="text-slate-600">Free cancellation and date changes on selected flights</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Flights;
