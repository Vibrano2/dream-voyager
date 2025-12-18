import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <img
                            src="/logo.png"
                            alt="Dream Voyager"
                            className="h-12 w-auto mb-4"
                        />
                        <p className="text-gray-300 text-sm mb-4">
                            Your trusted partner for unforgettable travel experiences.
                            Explore the world with confidence and style.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-skyblue flex items-center justify-center transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-skyblue flex items-center justify-center transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-skyblue flex items-center justify-center transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/packages" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Travel Packages
                                </Link>
                            </li>
                            <li>
                                <Link to="/destinations" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Destinations
                                </Link>
                            </li>
                            <li>
                                <Link to="/visa" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Visa Assistance
                                </Link>
                            </li>
                            <li>
                                <Link to="/study-visa" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Study Visa Assist
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-4">Our Services</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/flights" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Flight Bookings
                                </Link>
                            </li>
                            <li>
                                <Link to="/honeymoon" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Honeymoon Packages
                                </Link>
                            </li>
                            <li>
                                <Link to="/corporate" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Corporate Travel
                                </Link>
                            </li>
                            <li>
                                <Link to="/insurance" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    Travel Insurance
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    24/7 Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-brand-skyblue mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">
                                    123 Travel Street, Lagos, Nigeria
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-brand-skyblue flex-shrink-0" />
                                <a href="tel:+2348001234567" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    +234 800 DREAM VOY
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-brand-skyblue flex-shrink-0" />
                                <a href="mailto:hello@dreamvoyager.com" className="text-gray-300 hover:text-brand-skyblue transition-colors text-sm">
                                    hello@dreamvoyager.com
                                </a>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <h4 className="font-medium mb-2 text-sm">Subscribe to Newsletter</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-brand-skyblue"
                                />
                                <button className="px-4 py-2 bg-brand-orange hover:bg-[#d67a1f] rounded-lg font-medium text-sm transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Dream Voyager. All rights reserved. <span className="opacity-50 ml-2 text-xs">v1.1 (Prod)</span>
                        </p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="text-gray-400 hover:text-brand-skyblue transition-colors text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-brand-skyblue transition-colors text-sm">
                                Terms of Service
                            </Link>
                            <Link to="/cookies" className="text-gray-400 hover:text-brand-skyblue transition-colors text-sm">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
