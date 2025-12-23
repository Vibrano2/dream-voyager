import { useState } from 'react';
import { Shield, CheckCircle2, AlertCircle, ArrowRight, Phone, Mail, FileText, Umbrella } from 'lucide-react';

const Insurance = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDate: '',
        duration: '',
        travelers: '1'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API
            alert('Your insurance quote request has been received. One of our agents will contact you shortly.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                destination: '',
                travelDate: '',
                duration: '',
                travelers: '1'
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-indigo-900 to-blue-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920"
                        alt="Insurance"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                        <Shield size={20} className="text-indigo-300" />
                        <span className="font-semibold">Travel Protection</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Travel with Confidence</h1>
                    <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
                        Comprehensive travel insurance plans to protect you and your loved ones from the unexpected.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Umbrella, title: "Medical Coverage", desc: "Emergency medical expenses and evacuation" },
                        { icon: AlertCircle, title: "Trip Cancellation", desc: "Reimbursement for non-refundable costs" },
                        { icon: FileText, title: "Lost Baggage", desc: "Coverage for lost, stolen or damaged luggage" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl text-center border border-slate-100">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <item.icon size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Info Section */}
                    <div>
                        <h2 className="font-heading text-3xl font-bold mb-6">Why Do You Need Travel Insurance?</h2>
                        <div className="space-y-6">
                            {[
                                "Unexpected illness or injury abroad",
                                "Flight cancellations or severe delays",
                                "Lost or stolen passport and travel documents",
                                "Legal liability protection",
                                "24/7 Global emergency assistance"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                <Phone size={18} /> Need Immediate Assistance?
                            </h4>
                            <p className="text-indigo-700 text-sm mb-4">
                                Our support team is available 24/7 to help with claims and emergencies.
                            </p>
                            <a href="tel:+2348001234567" className="text-indigo-600 font-bold hover:underline">
                                Call +234 800 DREAM VOY
                            </a>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 text-white p-6">
                            <h3 className="font-heading text-xl font-bold">Get a Free Quote</h3>
                            <p className="text-slate-400 text-sm">Fill details to get customized insurance plans</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-slate-700">Full Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-slate-700">Email Address</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-slate-700">Phone Number</label>
                                    <input
                                        type="tel" required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="+234..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-slate-700">Destination</label>
                                    <input
                                        type="text" required
                                        value={formData.destination}
                                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Europe, USA, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-slate-700">Travel Date</label>
                                    <input
                                        type="date" required
                                        value={formData.travelDate}
                                        onChange={e => setFormData({ ...formData, travelDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-slate-700">Duration (Days)</label>
                                    <input
                                        type="number" required min="1"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="7"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                Request Quote <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insurance;
