import { useState } from 'react';
import { Briefcase, Users, Globe, TrendingUp, ArrowRight, CheckCircle2, Clock, DollarSign, Shield, Zap, BarChart3, Headphones } from 'lucide-react';

interface CorporateService {
    icon: any;
    title: string;
    description: string;
    features: string[];
}

const services: CorporateService[] = [
    {
        icon: Globe,
        title: "International Business Travel",
        description: "Seamless global travel management for your executives and teams",
        features: ["Multi-city itineraries", "Visa assistance", "24/7 travel support", "Preferred airline partnerships"]
    },
    {
        icon: Users,
        title: "Group Bookings",
        description: "Coordinated travel for conferences, meetings, and corporate events",
        features: ["Volume discounts", "Dedicated coordinator", "Flexible cancellation", "Group check-in assistance"]
    },
    {
        icon: BarChart3,
        title: "Expense Management",
        description: "Streamlined reporting and budget control for corporate travel",
        features: ["Detailed invoicing", "Spend analytics", "Budget tracking", "Automated reports"]
    },
    {
        icon: Shield,
        title: "Travel Policy Compliance",
        description: "Ensure all bookings align with your company's travel policies",
        features: ["Policy enforcement", "Approval workflows", "Compliance reporting", "Custom rules"]
    }
];

const Corporate = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        employees: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920"
                        alt="Corporate"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-[120px] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Briefcase size={20} className="text-blue-300" />
                            <span className="font-semibold">Corporate Travel Solutions</span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                            Elevate Your Business Travel
                        </h1>
                        <p className="text-lg text-blue-100 mb-8">
                            Comprehensive travel management solutions designed for modern businesses
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
                                Request a Quote
                                <ArrowRight size={20} />
                            </button>
                            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 -mt-12 relative z-10 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { value: "500+", label: "Corporate Clients" },
                        { value: "50K+", label: "Trips Managed" },
                        { value: "98%", label: "Client Satisfaction" },
                        { value: "24/7", label: "Support Available" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 text-center border border-slate-100">
                            <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                            <p className="text-slate-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Section */}
            <div className="container mx-auto px-4 mb-20">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Corporate Services</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Tailored solutions to streamline your business travel operations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                                <service.icon size={32} className="text-white" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-3">{service.title}</h3>
                            <p className="text-slate-600 mb-6">{service.description}</p>
                            <ul className="space-y-3">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-slate-50 py-16 mb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Choose Dream Voyager?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We deliver value through efficiency, savings, and exceptional service
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: DollarSign, title: "Cost Savings", description: "Negotiated corporate rates and volume discounts" },
                            { icon: Clock, title: "Time Efficiency", description: "Streamlined booking and approval processes" },
                            { icon: Headphones, title: "Dedicated Support", description: "Personal account manager for your company" },
                            { icon: Zap, title: "Quick Response", description: "Fast turnaround for urgent travel needs" }
                        ].map((benefit, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <benefit.icon size={28} className="text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-sm text-slate-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8">
                            <h2 className="font-heading text-3xl font-bold mb-2">Get Started Today</h2>
                            <p className="text-blue-100">Fill out the form below and our corporate travel team will contact you within 24 hours</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Company Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Your Company Ltd."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Contact Person *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="john@company.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+234 800 000 0000"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Number of Employees</label>
                                    <select
                                        value={formData.employees}
                                        onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        <option value="">Select range</option>
                                        <option value="1-50">1-50</option>
                                        <option value="51-200">51-200</option>
                                        <option value="201-500">201-500</option>
                                        <option value="500+">500+</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Tell us about your corporate travel needs..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                Submit Request
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mt-20">
                <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-12 text-white text-center">
                    <TrendingUp size={48} className="mx-auto mb-4 text-blue-300" />
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Optimize Your Business Travel?</h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                        Join hundreds of companies that trust Dream Voyager for their corporate travel needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-xl">
                            Download Brochure
                        </button>
                        <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Corporate;
