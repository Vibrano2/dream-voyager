import { useState, useEffect } from 'react';
import { Search, Shield, User, Mail, Phone, Calendar, Edit2, X } from 'lucide-react';
import api from '../../../services/api';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: 'admin' | 'customer' | 'agent';
    created_at: string;
    avatar_url?: string;
}

const AdminUsers = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            await api.put(`/admin/users/${userId}`, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user role', error);
            alert('Failed to update user role');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-700';
            case 'agent': return 'bg-blue-100 text-blue-700';
            default: return 'bg-green-100 text-green-700';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return Shield;
            case 'agent': return User;
            default: return User;
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Roles</option>
                    <option value="customer">Customers</option>
                    <option value="agent">Agents</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <User className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{users.filter(u => u.role === 'customer').length}</p>
                            <p className="text-sm text-slate-500">Customers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{users.filter(u => u.role === 'agent').length}</p>
                            <p className="text-sm text-slate-500">Agents</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <Shield className="text-red-600" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{users.filter(u => u.role === 'admin').length}</p>
                            <p className="text-sm text-slate-500">Admins</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">User</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Contact</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Role</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Joined</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => {
                                const RoleIcon = getRoleIcon(user.role);
                                return (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.full_name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {user.phone ? (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone size={14} />
                                                    {user.phone}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm">No phone</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-slate-200 cursor-pointer ${getRoleBadgeColor(user.role)}`}
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="agent">Agent</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100 mt-6">
                    <p className="text-slate-500">No users found</p>
                </div>
            )}

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">User Details</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUser(null);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Avatar & Name */}
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {selectedUser.full_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">{selectedUser.full_name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedUser.role === 'admin' ? 'bg-red-100 text-red-700' :
                                            selectedUser.role === 'agent' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {selectedUser.role.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Mail className="text-slate-400" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500">Email</p>
                                            <p className="font-medium text-slate-800">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Phone className="text-slate-400" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500">Phone</p>
                                            <p className="font-medium text-slate-800">{selectedUser.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Account Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Calendar className="text-slate-400" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500">Member Since</p>
                                            <p className="font-medium text-slate-800">
                                                {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Shield className="text-slate-400" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500">User ID</p>
                                            <p className="font-mono text-sm text-slate-800">{selectedUser.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: Implement edit functionality
                                        alert('Edit functionality coming soon!');
                                    }}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium"
                                >
                                    Edit User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


};

export default AdminUsers;
