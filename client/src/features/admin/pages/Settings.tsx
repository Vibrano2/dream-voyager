import { useState, useEffect } from 'react';
import { Save, Mail, DollarSign, Globe, Shield } from 'lucide-react';
import api from '../../../services/api';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'Dream Voyager',
        siteEmail: 'info@dreamvoyager.com',
        supportEmail: 'support@dreamvoyager.com',
        currency: 'NGN',
        paystackPublicKey: '',
        paystackSecretKey: '',
        resendApiKey: '',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true
    });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/settings');
            if (res.data) {
                // Map snake_case DB to camelCase State
                setSettings({
                    siteName: res.data.site_name,
                    siteEmail: res.data.site_email,
                    supportEmail: res.data.support_email,
                    currency: res.data.currency,
                    paystackPublicKey: res.data.paystack_public_key || '',
                    paystackSecretKey: res.data.paystack_secret_key || '',
                    resendApiKey: res.data.resend_api_key || '',
                    maintenanceMode: res.data.maintenance_mode,
                    allowRegistration: res.data.allow_registration,
                    requireEmailVerification: res.data.require_email_verification
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Map camelCase State to snake_case DB
            const dbSettings = {
                site_name: settings.siteName,
                site_email: settings.siteEmail,
                support_email: settings.supportEmail,
                currency: settings.currency,
                paystack_public_key: settings.paystackPublicKey,
                paystack_secret_key: settings.paystackSecretKey,
                resend_api_key: settings.resendApiKey,
                maintenance_mode: settings.maintenanceMode,
                allow_registration: settings.allowRegistration,
                require_email_verification: settings.requireEmailVerification
            };

            await api.put('/admin/settings', dbSettings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save settings');
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="max-w-4xl">
            <form onSubmit={handleSave} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="text-blue-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">General Settings</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Site Email</label>
                                <input
                                    type="email"
                                    value={settings.siteEmail}
                                    onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
                            <select
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="NGN">Nigerian Naira (₦)</option>
                                <option value="USD">US Dollar ($)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="GBP">British Pound (£)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-green-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Payment Gateway (Paystack)</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Public Key</label>
                            <input
                                type="text"
                                value={settings.paystackPublicKey}
                                onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
                                placeholder="pk_live_..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Secret Key</label>
                            <input
                                type="password"
                                value={settings.paystackSecretKey}
                                onChange={(e) => setSettings({ ...settings, paystackSecretKey: e.target.value })}
                                placeholder="sk_live_..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Mail className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Email Service (Resend)</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Resend API Key</label>
                        <input
                            type="password"
                            value={settings.resendApiKey}
                            onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                            placeholder="re_..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Security & Access */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Shield className="text-red-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Security & Access</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-800">Maintenance Mode</p>
                                <p className="text-sm text-slate-500">Disable public access to the site</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-800">Allow Registration</p>
                                <p className="text-sm text-slate-500">Allow new users to create accounts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.allowRegistration}
                                    onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-800">Require Email Verification</p>
                                <p className="text-sm text-slate-500">Users must verify email before login</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.requireEmailVerification}
                                    onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    {saved && (
                        <div className="text-green-600 font-medium">✓ Settings saved successfully!</div>
                    )}
                    <div className="ml-auto">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold"
                        >
                            <Save size={20} />
                            Save Settings
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
