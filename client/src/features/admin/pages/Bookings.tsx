import { useState, useEffect } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import api from '../../../services/api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/admin/bookings');
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            // alert('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/admin/bookings/${id}`, { status: newStatus });
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Update failed', error);
        }
    };

    if (loading) return <div>Loading bookings...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Reference</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Customer</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Package</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Amount</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Date</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{booking.booking_reference}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="font-medium text-slate-900">{booking.profiles?.full_name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500">{booking.profiles?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{booking.packages?.title}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">₦{booking.total_amount?.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-slate-200 cursor-pointer ${booking.status === 'CONFIRMED' || booking.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="PAID">PAID</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{new Date(booking.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-brand-skyblue hover:bg-brand-pale-aqua rounded-lg transition-colors" title="View Details">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
