import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
    {
        id: 1,
        name: "Dubai",
        image: "https://images.unsplash.com/photo-1512453979798-5ea936a7fe48?auto=format&fit=crop&q=80&w=800",
        description: "Experience luxury in the desert with futuristic architecture and shopping.",
        packages: 12
    },
    {
        id: 2,
        name: "Paris",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
        description: "The city of love, art, and fashion awaits your arrival.",
        packages: 8
    },
    {
        id: 3,
        name: "Bali",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
        description: "Tropical paradise with lush jungles, beaches, and vibrant culture.",
        packages: 15
    },
    {
        id: 4,
        name: "Santorini",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
        description: "Iconic white buildings and breathtaking sunsets over the Aegean Sea.",
        packages: 6
    },
    {
        id: 5,
        name: "London",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
        description: "Historic landmarks, modern culture, and royal experiences.",
        packages: 10
    },
    {
        id: 6,
        name: "Kenya",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
        description: "Witness the Great Migration and explore majestic wildlife.",
        packages: 9
    }
];

const Destinations = () => {
    return (
        <div className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-4">Explore Destinations</h1>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
                Discover the world's most breathtaking locations. From vibrant cities to serene beaches, your dream vacation starts here.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((dest) => (
                    <div key={dest.id} className="group relative rounded-2xl overflow-hidden shadow-lg h-[400px] cursor-pointer">
                        <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white transition-opacity duration-300">
                            <h3 className="font-heading text-3xl font-bold mb-2">{dest.name}</h3>
                            <p className="text-white/90 mb-4 line-clamp-2">{dest.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                    <MapPin size={14} /> {dest.packages} Packages
                                </span>
                                <Link to={`/packages?location=${dest.name}`} className="w-10 h-10 rounded-full bg-[#F49129] flex items-center justify-center hover:bg-white hover:text-[#F49129] transition-colors">
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Destinations;
