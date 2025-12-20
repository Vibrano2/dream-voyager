import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, CalendarDays, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';

const AdminLayout = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to admin login if not authenticated
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Redirect to home if not admin
    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
        { icon: Package, label: 'Packages', path: '/admin/packages' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <img
                            src="/logo.png"
                            alt="Dream Voyager"
                            className="h-8 w-auto"
                        />
                        <span className="font-heading font-bold text-lg text-slate-800">
                            Dream Admin
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-brand-skyblue text-white font-medium'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg w-full transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm border-b border-gray-100 p-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-xl text-slate-800 capitalize">
                            {location.pathname.split('/').pop() || 'Dashboard'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800">{user.full_name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                {user.full_name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
