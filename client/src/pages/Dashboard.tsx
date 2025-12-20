import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { Package, Calendar, CreditCard, Download, FileText, Map, User } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [loadingDeliveries, setLoadingDeliveries] = useState(false);

    // Mock Bookings Data (replace with API call later)
    const bookings = [
        {
            id: 'DV-839201',
            package: 'Dubai Luxury Experience',
            date: '2024-12-25',
            status: 'confirmed',
            amount: '₦2,500,000',
            image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=200'
        },
        {
            id: 'DV-992834',
            package: 'Paris Romantic Getaway',
            date: '2025-02-14',
            status: 'pending',
            amount: '₦3,800,000',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=200'
        }
    ];

    // Fetch deliveries when tab changes
    useEffect(() => {
        if (activeTab === 'deliveries') {
            fetchDeliveries();
        }
    }, [activeTab]);

    const fetchDeliveries = async () => {
        setLoadingDeliveries(true);
        try {
            // In a real scenario, we'd uncomment this line:
            // const response = await api.get('/deliveries/my-deliveries');
            // setDeliveries(response.data);

            // For demo/mock purposes, verify UI with mock data if API is empty or failing
            const response = await api.get('/deliveries/my-deliveries');
            setDeliveries(response.data);
        } catch (error) {
            console.error('Failed to fetch deliveries', error);
            // Fallback for demo if backend is not yet populated
            setDeliveries([
                { id: '1', title: 'E-Ticket: Dubai Flight', type: 'ticket', status: 'available', created_at: '2024-12-10' },
                { id: '2', title: 'Itinerary - Day 1', type: 'itinerary', status: 'available', created_at: '2024-12-12' }
            ]);
        } finally {
            setLoadingDeliveries(false);
        }
    };

    const handleDownload = async (_id: string, title: string) => {
        try {
            // const res = await api.get(`/deliveries/download/${id}`);
            // window.open(res.data.downloadUrl, '_blank');
            alert(`Downloading ${title}...`); // Placeholder
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    return (
        <div className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 bg-brand-pale-aqua rounded-full flex items-center justify-center text-brand-skyblue text-2xl font-bold mb-3">
                                {user?.full_name?.charAt(0) || <User size={40} />}
                            </div>
                            <h2 className="font-bold text-lg text-center">{user?.full_name || 'User'}</h2>
                            <p className="text-sm text-slate-500 text-center break-all">{user?.email}</p>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'bookings' ? 'bg-brand-skyblue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Package size={18} /> My Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab('deliveries')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'deliveries' ? 'bg-brand-skyblue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Download size={18} /> Digital Deliveries
                            </button>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'payments' ? 'bg-brand-skyblue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <CreditCard size={18} /> Payments
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-6 capitalize">{activeTab.replace('-', ' ')}</h1>

                    {activeTab === 'bookings' && (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                                    <img src={booking.image} alt={booking.package} className="w-full md:w-32 h-32 object-cover rounded-xl" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg">{booking.package}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {booking.date}</span>
                                            <span className="flex items-center gap-1"><CreditCard size={14} /> {booking.amount}</span>
                                        </div>
                                        <button className="text-brand-skyblue font-medium text-sm hover:underline">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'deliveries' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {loadingDeliveries ? (
                                <div className="p-8 text-center text-slate-500">Loading deliveries...</div>
                            ) : deliveries.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {deliveries.map((item) => (
                                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                    {item.type === 'ticket' ? <FileText size={20} /> : <Map size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                                    <p className="text-xs text-slate-500 uppercase">{item.type} • {new Date(item.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(item.id, item.title)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Download size={16} /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Download size={32} />
                                    </div>
                                    <h3 className="font-bold text-slate-700 mb-1">No digital items yet</h3>
                                    <p className="text-slate-500 text-sm">Tickets and itineraries will appear here after booking confirmation.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                            <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="font-bold text-slate-700">No payment history</h3>
                            <p className="text-slate-500 text-sm mt-2">Your recent transactions will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
