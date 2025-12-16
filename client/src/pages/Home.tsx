import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';

const dubaispecials = [
    {
        title: "Atlantis The Royal Experience",
        location: "Dubai, UAE",
        duration: "5 Days / 4 Nights",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=800",
        price: "₦2,500,000",
        description: "Experience the ultimate luxury at the world's most experiential resort.",
        featured: true
    },
    {
        title: "Dubai Marina Yacht Cruise",
        location: "Dubai Marina",
        duration: "3 Days / 2 Nights",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef6c0?auto=format&fit=crop&q=80&w=800",
        price: "₦850,000",
        description: "Sunset yacht cruise with dinner and transfers included.",
        featured: false
    },
    {
        title: "Desert Safari Adventure",
        location: "Dubai Desert",
        duration: "4 Days / 3 Nights",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1451337516015-6b6fcd53e5af?auto=format&fit=crop&q=80&w=800",
        price: "₦950,000",
        description: "Dune bashing, camel riding, and BBQ dinner under the stars.",
        featured: false
    },
    {
        title: "Museum of the Future",
        location: "Sheikh Zayed Road",
        duration: "5 Days / 4 Nights",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1512453979798-5ea936a7fe48?auto=format&fit=crop&q=80&w=800",
        price: "₦1,200,000",
        description: "Visit the most beautiful building on earth and explore future tech.",
        featured: false
    }
];

const europeTours = [
    {
        title: "Paris Romantic Escape",
        location: "Paris, France",
        duration: "6 Days / 5 Nights",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
        price: "₦3,800,000",
        description: "Eiffel Tower dinner, Seine cruise, and Louvre museum tour.",
        featured: true
    },
    {
        title: "Santorini Sunset Dreams",
        location: "Santorini, Greece",
        duration: "5 Days / 4 Nights",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
        price: "₦2,950,000",
        description: "Stay in a cave hotel in Oia with private pool and sunset views.",
        featured: true
    },
    {
        title: "Rome & Vatican City",
        location: "Rome, Italy",
        duration: "5 Days / 4 Nights",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800",
        price: "₦2,400,000",
        description: "Skip-the-line access to Colosseum and Vatican Museums.",
        featured: false
    },
    {
        title: "Swiss Alps Adventure",
        location: "Interlaken, Switzerland",
        duration: "6 Days / 5 Nights",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800",
        price: "₦4,200,000",
        description: "Train rides through the Alps, chocolate factory visit, and skiing.",
        featured: false
    }
];

const Home = () => {
    // Promo date 24 hours from now
    const promoDate = new Date();
    promoDate.setHours(promoDate.getHours() + 24);

    return (
        <div className="min-h-screen pb-20">
            <Hero />
            <CategorySection
                id="package-displays"
                title="Dubai Specials"
                packages={dubaispecials}
                promoDate={promoDate}
                link="/packages?region=dubai"
            />
            <div className="bg-slate-50">
                <CategorySection
                    title="European Tours"
                    packages={europeTours}
                    link="/packages?region=europe"
                />
            </div>
        </div>
    );
};

export default Home;
