import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Mail, Lock, Shield } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { session, user } = response.data;

            console.log('Login response:', user); // Debug log

            // The backend returns role in user.profile.role OR user.user_metadata.role
            const userRole = user.profile?.role || user.user_metadata?.role || user.role;

            // Check if user has admin role
            if (userRole !== 'admin') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            // Construct user object with role at top level for consistency
            const userWithRole = {
                ...user,
                role: userRole,
                full_name: user.profile?.full_name || user.full_name,
                avatar_url: user.profile?.avatar_url || user.avatar_url
            };

            login(session.access_token, userWithRole);
            navigate('/admin');
        } catch (err: any) {
            console.error('Admin login error:', err);
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen pt-24 pb-12 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center relative"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2070')" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-slate-900/90 backdrop-blur-sm"></div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Shield size={40} className="text-white" />
                    </div>
                </div>
                <h2 className="text-center text-4xl font-heading font-bold text-white drop-shadow-lg mb-2">
                    Admin Portal
                </h2>
                <p className="text-center text-sm text-blue-200 drop-shadow">
                    Secure access for administrators only
                </p>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/95 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-t-4 border-blue-500">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex items-center">
                                    <Shield size={20} className="text-red-500 mr-2" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Admin Email
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="admin@dreamvoyager.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white transition-all duration-200
                                ${loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Shield size={18} />
                                        Sign in to Admin Portal
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Not an admin?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                Customer Login
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-blue-200">
                    Protected area. Unauthorized access is prohibited.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
