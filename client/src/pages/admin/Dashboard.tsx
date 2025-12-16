import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users as UsersIcon, Activity } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalUsers: 0,
        activePackages: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // For now, use mock data if backend isn't fully ready or returns empty
            const res = await api.get('/admin/stats');
            setStats(res.data.stats);
        } catch (error) {
            console.error('Failed to fetch admin stats', error);
            // Fallback Mock Data for demo
            setStats({
                totalBookings: 124,
                totalUsers: 56,
                activePackages: 12,
                totalRevenue: 15400000
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading stats...</div>;

    const cards = [
        { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
        { label: 'Active Packages', value: stats.activePackages, icon: Activity, color: 'bg-indigo-100 text-indigo-600' },
        { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last 30 Days</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">{card.value}</h3>
                        <p className="text-sm text-slate-500">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                <div className="text-center py-10 text-slate-500">
                    Chart integration coming soon...
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
