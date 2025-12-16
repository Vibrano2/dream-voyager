import { Plane, Map, Building2, GraduationCap, Ship, Briefcase, CheckCircle2 } from 'lucide-react';

const services = [
    {
        icon: Plane,
        title: "Flight Bookings",
        description: "Best deals on international and local flights. We handle ticketing, seat selection, and special requests for a seamless journey.",
        features: ["Global Airline Partners", "24/7 Support", "Best Price Guarantee", "Flexible Modification"]
    },
    {
        icon: GraduationCap,
        title: "Study Visa Assistance",
        description: "Comprehensive support for students aspiring to study abroad. From university selection to visa application and interview prep.",
        features: ["Admission Guidance", "Document Review", "Visa Application", "Pre-departure Briefing"]
    },
    {
        icon: Building2,
        title: "Hotel Reservations",
        description: "Luxury stays to budget-friendly accommodations. We partner with top hotel chains worldwide to give you the best comfort.",
        features: ["Luxury & Boutique Hotels", "Exclusive Rates", "Free Cancellation Options", "Loyalty Rewards"]
    },
    {
        icon: Briefcase,
        title: "Corporate Travel",
        description: "Tailored travel management solutions for businesses. Streamline your corporate trips with our dedicated agent support.",
        features: ["Expense Management", "Policy Compliance", "Group Bookings", "Priority Support"]
    },
    {
        icon: Map,
        title: "Custom Tour Packages",
        description: "Personalized itineraries designed around your preferences. Whether it's adventure, relaxation, or culture, we curate it for you.",
        features: ["Tailor-made Itineraries", "Local Guides", "Unique Experiences", "End-to-end Handling"]
    },
    {
        icon: Ship,
        title: "Cruises & Luxury Transport",
        description: "Set sail on premium cruise lines or travel in style with our luxury car rental and chauffeur services.",
        features: ["Ocean & River Cruises", "Private Yacht Charters", "Luxury Transfers", "Helicopter Tours"]
    }
];

const Services = () => {
    return (
        <div className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Premium Services</h1>
                <p className="text-slate-600 text-lg">
                    At Dream Voyager, we go beyond just booking. We provide comprehensive travel solutions tailored to your unique needs, ensuring every journey is memorable.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 bg-brand-pale-aqua rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#F49129] transition-colors duration-300">
                            <service.icon size={28} className="text-[#38BDF8] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="font-heading text-2xl font-bold mb-3">{service.title}</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {service.description}
                        </p>
                        <ul className="space-y-2">
                            {service.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                    <CheckCircle2 size={16} className="text-green-500" /> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-20 bg-slate-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] rounded-full filter blur-[100px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F49129] rounded-full filter blur-[100px] opacity-20"></div>

                <div className="relative z-10">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to plan your next trip?</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                        Contact our travel experts today for a free consultation. We'll help you create the perfect itinerary for your budget and preferences.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn-accent text-lg px-8">Book a Consultation</button>
                        <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-medium">Contact Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
