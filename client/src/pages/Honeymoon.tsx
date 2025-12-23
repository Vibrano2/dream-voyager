import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, ArrowRight, Search, Star, Sparkles, Wine, Palmtree } from 'lucide-react';

interface HoneymoonPackage {
    id: number;
    title: string;
    destination: string;
    image: string;
    duration: string;
    rating: number;
    reviews: number;
    price: string;
    includes: string[];
    description: string;
    featured?: boolean;
}

const honeymoonPackages: HoneymoonPackage[] = [
    {
        id: 1,
        title: "Maldives Paradise Romance",
        destination: "Maldives",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
        duration: "7 Days / 6 Nights",
        rating: 5.0,
        reviews: 245,
        price: "₦4,500,000",
        includes: ["Overwater Villa", "Private Pool", "Couples Spa", "Candlelit Dinners", "Water Sports"],
        description: "Ultimate luxury in an overwater villa with private pool and stunning ocean views",
        featured: true
    },
    {
        id: 2,
        title: "Santorini Sunset Romance",
        destination: "Santorini, Greece",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
        duration: "6 Days / 5 Nights",
        rating: 4.9,
        reviews: 189,
        price: "₦3,200,000",
        includes: ["Cave Hotel Suite", "Wine Tasting", "Sunset Cruise", "Couples Massage", "Private Tours"],
        description: "Romantic escape in a luxury cave hotel with breathtaking caldera views",
        featured: true
    },
    {
        id: 3,
        title: "Bali Tropical Getaway",
        destination: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
        duration: "8 Days / 7 Nights",
        rating: 4.8,
        reviews: 312,
        price: "₦2,800,000",
        includes: ["Private Villa", "Jungle Views", "Spa Treatments", "Cultural Tours", "Beach Access"],
        description: "Secluded villa surrounded by lush tropical gardens and rice terraces"
    },
    {
        id: 4,
        title: "Paris City of Love",
        destination: "Paris, France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
        duration: "5 Days / 4 Nights",
        rating: 4.7,
        reviews: 156,
        price: "₦3,500,000",
        includes: ["5-Star Hotel", "Eiffel Tower Dinner", "Seine Cruise", "Museum Passes", "Champagne Tour"],
        description: "Classic romance in the heart of Paris with iconic experiences"
    },
    {
        id: 5,
        title: "Seychelles Beach Bliss",
        destination: "Seychelles",
        image: "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?auto=format&fit=crop&q=80&w=800",
        duration: "7 Days / 6 Nights",
        rating: 4.9,
        reviews: 198,
        price: "₦4,200,000",
        includes: ["Beachfront Villa", "Island Hopping", "Snorkeling", "Private Beach Dinners", "Spa Package"],
        description: "Pristine beaches and crystal-clear waters in a tropical paradise"
    },
    {
        id: 6,
        title: "Dubai Luxury Romance",
        destination: "Dubai, UAE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea936a7fe48?auto=format&fit=crop&q=80&w=800",
        duration: "5 Days / 4 Nights",
        rating: 4.8,
        reviews: 223,
        price: "₦3,800,000",
        includes: ["Burj Al Arab Suite", "Desert Safari", "Yacht Cruise", "Fine Dining", "Shopping Tour"],
        description: "Opulent luxury in the world's most glamorous city"
    }
];

const Honeymoon = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        destination: '',
        duration: '',
        budget: '',
        travelers: 2
    });

    const handleBook = (pkg: HoneymoonPackage) => {
        // Navigate to booking page with package details
        navigate('/book', {
            state: {
                type: 'package',
                packageData: {
                    id: `mock-${pkg.id}`, // Mock ID since these aren't in DB yet
                    title: pkg.title,
                    price: parseInt(pkg.price.replace(/[^0-9]/g, '')),
                    description: pkg.description
                }
            }
        });
    };

    const filteredPackages = honeymoonPackages.filter(pkg => {
        const matchDest = pkg.destination.toLowerCase().includes(searchParams.destination.toLowerCase()) ||
            pkg.title.toLowerCase().includes(searchParams.destination.toLowerCase());

        let matchDuration = true;
        if (searchParams.duration) {
            const days = parseInt(pkg.duration);
            if (searchParams.duration === '3-5') matchDuration = days >= 3 && days <= 5;
            if (searchParams.duration === '5-7') matchDuration = days >= 5 && days <= 7;
            if (searchParams.duration === '7+') matchDuration = days > 7;
        }

        let matchBudget = true;
        if (searchParams.budget) {
            const price = parseInt(pkg.price.replace(/[^0-9]/g, ''));
            if (searchParams.budget === 'budget') matchBudget = price < 2000000;
            if (searchParams.budget === 'mid') matchBudget = price >= 2000000 && price <= 4000000;
            if (searchParams.budget === 'luxury') matchBudget = price > 4000000;
        }

        return matchDest && matchDuration && matchBudget;
    });

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-rose-900 via-pink-800 to-rose-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920"
                        alt="Honeymoon"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full filter blur-[120px] opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-400 rounded-full filter blur-[120px] opacity-30"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Heart size={20} className="text-pink-300 fill-current" />
                            <span className="font-semibold">Honeymoon Packages</span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                            Begin Your Forever Together
                        </h1>
                        <p className="text-lg text-rose-100 mb-8">
                            Curated romantic getaways for the perfect start to your married life
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="container mx-auto px-4 -mt-12 relative z-10 mb-16">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                    <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles size={24} className="text-pink-500" />
                        Find Your Dream Honeymoon
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Destination</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Where to?"
                                    value={searchParams.destination}
                                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Duration</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={searchParams.duration}
                                    onChange={(e) => setSearchParams({ ...searchParams, duration: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
                                >
                                    <option value="">Any</option>
                                    <option value="3-5">3-5 Days</option>
                                    <option value="5-7">5-7 Days</option>
                                    <option value="7+">7+ Days</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Budget</label>
                            <select
                                value={searchParams.budget}
                                onChange={(e) => setSearchParams({ ...searchParams, budget: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
                            >
                                <option value="">Any Budget</option>
                                <option value="budget">Under ₦2M</option>
                                <option value="mid">₦2M - ₦4M</option>
                                <option value="luxury">₦4M+</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                <Search size={20} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Romantic Destinations Await</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Handpicked honeymoon packages designed to create unforgettable memories
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.length > 0 ? (
                        filteredPackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                    {pkg.featured && (
                                        <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                                            <Heart size={14} className="fill-current" />
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                        <Star size={16} className="text-pink-500 fill-current" />
                                        <span className="font-bold text-slate-900">{pkg.rating}</span>
                                        <span className="text-slate-500 text-sm">({pkg.reviews})</span>
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="font-heading text-2xl font-bold text-white mb-1">{pkg.title}</h3>
                                        <p className="text-white/90 flex items-center gap-1 text-sm">
                                            <MapPin size={14} />
                                            {pkg.destination}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <p className="text-slate-600 mb-4 line-clamp-2">{pkg.description}</p>

                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                                        <Calendar size={16} className="text-pink-500" />
                                        <span>{pkg.duration}</span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-slate-500 mb-2">Package Includes:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {pkg.includes.slice(0, 3).map((item, idx) => (
                                                <span key={idx} className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-full">
                                                    {item}
                                                </span>
                                            ))}
                                            {pkg.includes.length > 3 && (
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                    +{pkg.includes.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Starting from</p>
                                            <p className="text-2xl font-bold text-slate-900">{pkg.price}</p>
                                        </div>
                                        <button
                                            onClick={() => handleBook(pkg)}
                                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group-hover:scale-105"
                                        >
                                            Book Now
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-slate-500 text-lg">No honeymoon packages found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="container mx-auto px-4 mt-20">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-12 text-white text-center">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Make Your Honeymoon Unforgettable</h2>
                    <p className="text-white/90 max-w-2xl mx-auto mb-8">
                        Let us handle every detail while you focus on celebrating your love
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Heart size={28} className="fill-current" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Romantic Touches</h3>
                            <p className="text-sm text-white/80">Special surprises and romantic amenities</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Wine size={28} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Luxury Experiences</h3>
                            <p className="text-sm text-white/80">Premium accommodations and dining</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Palmtree size={28} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Exotic Locations</h3>
                            <p className="text-sm text-white/80">Breathtaking destinations worldwide</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Personalized Service</h3>
                            <p className="text-sm text-white/80">Tailored to your preferences</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Honeymoon;
