import { Award, Users, Globe, HeartHandshake } from 'lucide-react';

const stats = [
    { label: "Years of Experience", value: "10+" },
    { label: "Happy Travelers", value: "50k+" },
    { label: "Destinations", value: "100+" },
    { label: "Awards Won", value: "15" }
];

const values = [
    {
        icon: Award,
        title: "Excellence",
        description: "We strive for perfection in every detail of your journey, ensuring high-quality experiences."
    },
    {
        icon: Users,
        title: "Customer Focus",
        description: "Your satisfaction is our priority. We listen to your needs and customize solutions for you."
    },
    {
        icon: Globe,
        title: "Global Network",
        description: "Strong partnerships with airlines, hotels, and local guides worldwide for seamless travel."
    },
    {
        icon: HeartHandshake,
        title: "Integrity",
        description: "Honest pricing, transparent policies, and reliable service you can trust implicitly."
    }
];

const About = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <div className="relative h-[400px] bg-slate-900 flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1920"
                    alt="Travel Adventure"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 text-center px-4">
                    <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">About Dream Voyager</h1>
                    <p className="text-xl text-slate-200 max-w-2xl mx-auto">
                        Turning your travel dreams into reality since 2015. We are your trusted partner in exploring the world.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Our Story */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <div className="inline-block px-4 py-1 bg-brand-pale-aqua text-brand-skyblue rounded-full text-sm font-bold mb-4">Our Story</div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-slate-900">Redefining Luxury Travel Experiences</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            Founded with a passion for exploration, Dream Voyager started as a small consultancy helping friends plan their honeymoons. Today, we have grown into a premier travel agency serving thousands of clients globally.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Our mission is simple: to make travel seamless, accessible, and unforgettable. Whether you are a student seeking education abroad, a couple looking for a romantic getaway, or a business executive on a tight schedule, we handle the logistics so you can focus on the experience.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img className="rounded-2xl shadow-lg mt-8" src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=600" alt="Travel Planning" />
                        <img className="rounded-2xl shadow-lg" src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600" alt="Happy Travelers" />
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-brand-skyblue rounded-3xl p-10 text-white mb-20 shadow-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-2">
                                <div className="text-4xl font-bold font-heading mb-1">{stat.value}</div>
                                <div className="text-sm opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values */}
                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl font-bold mb-4">Why Choose Us?</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        We don't just book trips; we curate experiences. Here is what sets us apart from the rest.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((val, idx) => (
                        <div key={idx} className="bg-slate-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 text-center group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:bg-[#F49129] group-hover:text-white transition-colors">
                                <val.icon size={28} className="text-slate-700 group-hover:text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{val.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {val.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
