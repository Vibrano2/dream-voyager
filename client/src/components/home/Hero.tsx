import { useState, useEffect } from 'react';
import { ChevronRight, Clock, ArrowRight, Plane, Briefcase, Map, Heart, Globe, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'Flight Bookings', icon: Plane, path: '/flights' },
    { name: 'Visa Assistance', icon: Map, path: '/visa' },
    { name: 'Honeymoon Deals', icon: Heart, path: '/honeymoon' },
    { name: 'Corporate Travel', icon: Briefcase, path: '/corporate' },
    { name: 'Study Visa Assist', icon: Globe, path: '/study-visa' },
];

const slides = [
    {
        id: 1,
        title: "Experience the Magic of Travel",
        subtitle: "Premium Luxury Journeys",
        bg: "/hero-cinematic.png",
        price: "Custom"
    },
    {
        id: 2,
        title: "Dubai Luxury Escape",
        subtitle: "Stay at Atlantis The Royal",
        bg: "https://images.unsplash.com/photo-1518684079851-30d1b985a59b?auto=format&fit=crop&q=80&w=1920",
        price: "$2,500"
    },
    {
        id: 3,
        title: "Parisian Romantic Getaway",
        subtitle: "Flight + 5 Star Hotel",
        bg: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1920",
        price: "$1,800"
    },
    {
        id: 4,
        title: "Maldives Paradise",
        subtitle: "Overwater Villa Experience",
        bg: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1920",
        price: "$3,200"
    },
    {
        id: 5,
        title: "Tokyo Neon Nights",
        subtitle: "City & Culture Tour",
        bg: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1920",
        price: "$2,100"
    },
    {
        id: 6,
        title: "Santorini Sunset",
        subtitle: "Greek Island Hopping",
        bg: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1920",
        price: "$1,950"
    }
];

const quickDeals = [
    { id: 1, title: 'Lagos to London', discount: '20% OFF', timer: '24h Left' },
    { id: 2, title: 'Rwanda Gorilla Trek', discount: '15% OFF', timer: '2 Days Left' },
    { id: 3, title: 'Zanzibar Summer', discount: 'Flat $100 OFF', timer: 'Limited' },
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showCategories, setShowCategories] = useState(true);
    const [showHeroText, setShowHeroText] = useState(true);
    const [showQuickDeals, setShowQuickDeals] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[600px] flex items-center pt-32 pb-16 overflow-hidden">
            {/* Full Width Background Slider */}
            <div className="absolute inset-0 z-0">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for readability */}
                        <img
                            src={slide.bg}
                            alt={slide.title}
                            className="w-full h-full object-cover transition-transform duration-[15000ms] ease-linear transform scale-100 hover:scale-105"
                        />
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column: Categories */}
                    <div className={`transition-all duration-300 lg:col-span-3 ${showCategories ? '' : 'w-auto justify-self-start'}`}>
                        {showCategories ? (
                            <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                                <div className="p-5 bg-slate-900/80 text-white backdrop-blur-sm border-b border-white/10 flex justify-between items-center">
                                    <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                                        <Sparkles size={20} className="text-[#F49129]" />
                                        Categories
                                    </h3>
                                    <button onClick={() => setShowCategories(false)} className="hover:text-[#F49129] transition-colors">
                                        <Minimize2 size={18} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto py-3 max-h-[400px]">
                                    {categories.map((cat, idx) => (
                                        <Link
                                            key={idx}
                                            to={cat.path}
                                            className="flex items-center justify-between px-5 py-4 hover:bg-white/20 group text-white transition-all duration-200 border-l-4 border-transparent hover:border-[#F49129]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-[#F49129] transition-colors duration-200">
                                                    <cat.icon size={20} className="text-white group-hover:text-white transition-colors duration-200" />
                                                </div>
                                                <span className="font-semibold text-sm">{cat.name}</span>
                                            </div>
                                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-[#F49129]" />
                                        </Link>
                                    ))}
                                    <Link to="/services" className="flex items-center gap-2 px-5 py-4 text-sm text-[#F49129] font-semibold hover:gap-3 transition-all duration-200 mt-2 hover:bg-white/10">
                                        View All Services <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowCategories(true)}
                                className="bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-xl hover:bg-[#F49129] transition-all group"
                                title="Show Categories"
                            >
                                <Maximize2 size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>

                    {/* Center: Hero Text (Floating) */}
                    <div className="col-span-1 lg:col-span-6 flex flex-col justify-center min-h-[400px]">
                        {showHeroText ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl text-white relative group mt-12">
                                <button
                                    onClick={() => setShowHeroText(false)}
                                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 z-20"
                                >
                                    <Minimize2 size={20} />
                                </button>
                                <div className="transition-all duration-500">
                                    <span className="inline-block bg-[#F49129] text-white font-semibold tracking-wide mb-3 px-3 py-1 rounded-full text-sm shadow-lg">
                                        {slides[currentSlide].subtitle}
                                    </span>
                                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
                                        {slides[currentSlide].title}
                                    </h2>
                                    <div className="flex items-center gap-5 mt-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-white/80 font-medium">Starting from</span>
                                            <span className="text-3xl font-bold text-[#F49129]">{slides[currentSlide].price}</span>
                                        </div>
                                        <a href="#package-displays" className="btn-accent flex items-center gap-2 group/btn px-6 py-3 text-base shadow-lg hover:shadow-[#F49129]/50 cursor-pointer">
                                            Book Now
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-8">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-[#F49129]' : 'w-2 bg-white/40 hover:bg-white/80'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-white/20 self-center flex items-center gap-4 animate-fade-in">
                                <span className="font-heading font-bold text-xl text-white shadow-black drop-shadow-md">
                                    {slides[currentSlide].title}
                                </span>
                                <button
                                    onClick={() => setShowHeroText(true)}
                                    className="bg-[#F49129] p-2 rounded-full text-white hover:scale-110 transition-transform"
                                    title="Show Details"
                                >
                                    <Maximize2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Quick Deals */}
                    <div className={`transition-all duration-300 lg:col-span-3 flex flex-col gap-5 ${showQuickDeals ? '' : 'w-auto justify-self-end'}`}>
                        {showQuickDeals ? (
                            <>
                                <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 text-white flex items-center justify-between shadow-xl border border-white/20">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={20} className="text-[#F49129]" />
                                        <span className="font-heading font-semibold text-lg">Quick Deals</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-500 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse shadow-lg">HOT</div>
                                        <button onClick={() => setShowQuickDeals(false)} className="hover:text-[#F49129] transition-colors">
                                            <Minimize2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    {quickDeals.map((deal, index) => (
                                        <a
                                            key={deal.id}
                                            href="#package-displays"
                                            className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20 flex-1 flex flex-col justify-center hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                                    {deal.discount}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
                                                    <Clock size={14} /> {deal.timer}
                                                </div>
                                            </div>
                                            <h3 className="font-heading font-bold text-white text-lg mb-2 group-hover:text-[#F49129] transition-colors">
                                                {deal.title}
                                            </h3>
                                            <div className="mt-auto text-sm text-[#F49129] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                                Grab Deal <ArrowRight size={16} />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowQuickDeals(true)}
                                className="bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-xl hover:bg-[#F49129] transition-all group flex items-center gap-2"
                                title="Show Fast Deals"
                            >
                                <span className="font-bold text-sm hidden group-hover:block whitespace-nowrap">Show Deals</span>
                                <Maximize2 size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
