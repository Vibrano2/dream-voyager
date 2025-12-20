import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Mail, Phone, User, MessageSquare, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../features/auth/context/AuthContext';

interface BookingFormProps {
    packageId?: string;
    packageTitle: string;
    packagePrice: number;
    packageImage?: string;
    packageLocation?: string;
    bookingType?: 'package' | 'flight' | 'visa' | 'study-visa' | 'custom';
}

interface PassengerDetail {
    name: string;
    age: number;
    passport?: string;
}

const BookingForm = ({ packageId, packageTitle, packagePrice, packageImage, packageLocation, bookingType = 'package' }: BookingFormProps) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        travelDate: '',
        numberOfTravelers: 1,
        contactEmail: user?.email || '',
        contactPhone: '',
        specialRequests: ''
    });

    const [passengers, setPassengers] = useState<PassengerDetail[]>([
        { name: '', age: 0, passport: '' }
    ]);

    const handleTravelerCountChange = (count: number) => {
        setFormData({ ...formData, numberOfTravelers: count });

        // Adjust passengers array
        if (count > passengers.length) {
            const newPassengers = [...passengers];
            for (let i = passengers.length; i < count; i++) {
                newPassengers.push({ name: '', age: 0, passport: '' });
            }
            setPassengers(newPassengers);
        } else {
            setPassengers(passengers.slice(0, count));
        }
    };

    const handlePassengerChange = (index: number, field: keyof PassengerDetail, value: string | number) => {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        setPassengers(updated);
    };

    const calculateTotal = () => {
        return packagePrice * formData.numberOfTravelers;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate passengers
            const invalidPassenger = passengers.find(p => !p.name || p.age <= 0);
            if (invalidPassenger) {
                setError('Please fill in all passenger details');
                setLoading(false);
                return;
            }

            // Create booking payload
            const bookingPayload: any = {
                passengers: formData.numberOfTravelers,
                travel_date: formData.travelDate,
                passenger_details: passengers,
                special_requests: formData.specialRequests,
                contact_email: formData.contactEmail,
                contact_phone: formData.contactPhone,
                booking_type: bookingType
            };

            // Add package_id or custom_price based on context
            if (packageId) {
                bookingPayload.package_id = packageId;
            } else {
                bookingPayload.custom_price = packagePrice;
            }

            // Create booking
            const response = await api.post('/bookings', bookingPayload);

            if (response.data.success) {
                // Redirect to payment page
                navigate(`/payment/${response.data.booking.id}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create booking. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Complete Your Booking</h2>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Travel Date */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Calendar size={18} />
                                        Travel Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.travelDate}
                                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Number of Travelers */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Users size={18} />
                                        Number of Travelers
                                    </label>
                                    <select
                                        value={formData.numberOfTravelers}
                                        onChange={(e) => handleTravelerCountChange(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Passenger Details */}
                                <div className="border-t border-slate-200 pt-6">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Passenger Details</h3>
                                    <div className="space-y-4">
                                        {passengers.map((passenger, index) => (
                                            <div key={index} className="bg-slate-50 p-4 rounded-lg space-y-3">
                                                <h4 className="font-medium text-slate-700">Passenger {index + 1}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-slate-600 mb-1">Full Name</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={passenger.name}
                                                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                                            placeholder="John Doe"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-slate-600 mb-1">Age</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="1"
                                                            max="120"
                                                            value={passenger.age || ''}
                                                            onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value))}
                                                            placeholder="25"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-slate-600 mb-1">Passport No. (Optional)</label>
                                                        <input
                                                            type="text"
                                                            value={passenger.passport}
                                                            onChange={(e) => handlePassengerChange(index, 'passport', e.target.value)}
                                                            placeholder="A12345678"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="border-t border-slate-200 pt-6">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                                <Mail size={16} />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.contactEmail}
                                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                                <Phone size={16} />
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.contactPhone}
                                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                                placeholder="+234 800 000 0000"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Special Requests */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <MessageSquare size={18} />
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        placeholder="Any special requirements or requests..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <CreditCard size={20} />
                                            Proceed to Payment
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Booking Summary</h3>

                            {packageImage && (
                                <img src={packageImage} alt={packageTitle} className="w-full h-40 object-cover rounded-lg mb-4" />
                            )}

                            <div className="space-y-3 mb-6">
                                <div>
                                    <p className="text-sm text-slate-500">Package</p>
                                    <p className="font-semibold text-slate-800">{packageTitle}</p>
                                </div>
                                {packageLocation && (
                                    <div>
                                        <p className="text-sm text-slate-500">Destination</p>
                                        <p className="font-medium text-slate-700">{packageLocation}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-slate-500">Travel Date</p>
                                    <p className="font-medium text-slate-700">
                                        {formData.travelDate || 'Not selected'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Travelers</p>
                                    <p className="font-medium text-slate-700">{formData.numberOfTravelers} {formData.numberOfTravelers === 1 ? 'Person' : 'People'}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Price per person</span>
                                    <span className="font-medium">₦{packagePrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Number of travelers</span>
                                    <span className="font-medium">× {formData.numberOfTravelers}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                                    <span>Total Amount</span>
                                    <span className="text-blue-600">₦{calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> You'll be redirected to secure payment after confirming your booking details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
