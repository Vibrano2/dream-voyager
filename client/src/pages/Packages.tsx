import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import CategorySection from '../components/home/CategorySection';

// Mock data - in real app fetch from API
const allPackages = [
    {
        title: "Atlantis The Royal Experience",
        location: "Dubai, UAE",
        duration: "5 Days / 4 Nights",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=800",
        price: "₦2,500,000",
        description: "Experience the ultimate luxury at the world's most experiential resort.",
        featured: true,
        category: "luxury"
    },
    {
        title: "Paris Romantic Escape",
        location: "Paris, France",
        duration: "6 Days / 5 Nights",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
        price: "₦3,800,000",
        description: "Eiffel Tower dinner, Seine cruise, and Louvre museum tour.",
        featured: true,
        category: "romance"
    },
    {
        title: "Bali Adventure",
        location: "Bali, Indonesia",
        duration: "7 Days / 6 Nights",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
        price: "₦1,800,000",
        description: "Explore lush jungles, ancient temples, and pristine beaches.",
        featured: false,
        category: "adventure"
    },
    {
        title: "London Business Trip",
        location: "London, UK",
        duration: "4 Days / 3 Nights",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
        price: "₦2,100,000",
        description: "Executive stay with conference access and luxury transport.",
        featured: false,
        category: "corporate"
    },
    {
        title: "Student Visa - Canada",
        location: "Toronto, Canada",
        duration: "Service",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&q=80&w=800",
        price: "₦500,000",
        description: "Complete study visa application assistance and guidance.",
        featured: false,
        category: "visa"
    }
];

const categories = [
    { id: 'all', name: 'All Packages' },
    { id: 'luxury', name: 'Luxury' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'romance', name: 'Honeymoon' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'visa', name: 'Visa Assist' },
];

const Packages = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPackages = allPackages.filter(pkg => {
        const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
        const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div>
                    <h1 className="font-heading text-4xl font-bold mb-2">Our Travel Packages</h1>
                    <p className="text-slate-600">Find the perfect package for your next journey</p>
                </div>

                <div className="relative w-full md:w-auto min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search locations or packages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F49129] focus:border-transparent bg-white shadow-sm"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mr-4 text-slate-400 font-medium">
                    <Filter size={18} /> Filters:
                </div>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                                ? 'bg-[#F49129] text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {filteredPackages.length > 0 ? (
                <CategorySection
                    title={selectedCategory === 'all' ? "All Packages" : `${categories.find(c => c.id === selectedCategory)?.name || ''} Packages`}
                    packages={filteredPackages}
                />
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl">
                    <p className="text-slate-500 text-lg">No packages found matching your criteria.</p>
                    <button
                        onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                        className="mt-4 text-[#F49129] font-medium hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Packages;
