import { ArrowRight, Star, Calendar, MapPin, TrendingUp } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import { Link } from 'react-router-dom';

interface Package {
    title: string;
    location: string;
    duration: string;
    rating: number;
    image: string;
    price: string;
    description: string;
    featured?: boolean;
}

interface PackageCardProps {
    pkg: Package;
}

interface CategorySectionProps {
    title: string;
    packages: Package[];
    link?: string;
    promoDate?: Date;
    id?: string;
}

const getResponsiveImageUrl = (url: string, width: number) => {
    try {
        if (url.includes('images.unsplash.com')) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('w', width.toString());
            urlObj.searchParams.set('q', '80');
            urlObj.searchParams.set('auto', 'format');
            return urlObj.toString();
        }
        return url;
    } catch {
        return url;
    }
};

const PackageCard = ({ pkg }: PackageCardProps) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer border border-slate-100/50 backdrop-blur-sm">
        <div className="relative h-56 overflow-hidden">
            <img
                src={getResponsiveImageUrl(pkg.image, 600)}
                srcSet={`
                    ${getResponsiveImageUrl(pkg.image, 400)} 400w,
                    ${getResponsiveImageUrl(pkg.image, 600)} 600w,
                    ${getResponsiveImageUrl(pkg.image, 800)} 800w
                `}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                alt={pkg.title}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                <Star size={14} className="text-[#F49129] fill-current" />
                <span>{pkg.rating}</span>
            </div>

            {pkg.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F49129] to-[#d67a1f] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    Featured
                </div>
            )}
        </div>

        <div className="p-6">
            <div className="flex justify-between items-center mb-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-[#F49129]" />
                    {pkg.location}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-[#F49129]" />
                    {pkg.duration}
                </div>
            </div>

            <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-[#F49129] transition-colors line-clamp-1">
                {pkg.title}
            </h3>

            <p className="text-sm text-slate-600 mb-5 line-clamp-2 leading-relaxed">
                {pkg.description}
            </p>

            <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium mb-1">Starting from</span>
                    <span className="font-bold text-2xl text-slate-900 font-heading">{pkg.price}</span>
                </div>
                <button className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 flex items-center justify-center text-slate-900 hover:from-[#F49129] hover:to-[#d67a1f] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl group-hover:scale-110">
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    </div>
);

const CategorySection = ({ title, packages, link, promoDate, id }: CategorySectionProps) => {
    return (
        <section id={id} className="py-16 container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div className="flex flex-col gap-3">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold flex items-center gap-4 text-slate-900">
                        {title}
                        {promoDate && (
                            <span className="text-sm font-normal bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full hidden md:inline-block shadow-lg">
                                Limited Time Offer
                            </span>
                        )}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-[#F49129] to-[#d67a1f] rounded-full"></div>
                </div>

                {promoDate && (
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100/50 backdrop-blur-sm">
                        <span className="text-sm font-semibold text-slate-700 px-2">Offer Ends In:</span>
                        <CountdownTimer targetDate={promoDate} />
                    </div>
                )}

                <Link
                    to={link || '#'}
                    className="hidden md:flex items-center gap-2 text-slate-700 hover:text-[#F49129] font-semibold transition-all duration-200 hover:gap-3 group"
                >
                    See All Packages
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {packages.map((pkg, idx) => (
                    <PackageCard key={idx} pkg={pkg} />
                ))}
            </div>

            <Link
                to={link || '#'}
                className="md:hidden mt-10 flex items-center justify-between w-full p-5 bg-white rounded-2xl text-slate-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100/50"
            >
                See All Packages
                <ArrowRight size={20} />
            </Link>
        </section>
    );
};

export default CategorySection;
