import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Support = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-heading font-bold mb-8 text-center">Contact Support</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Info */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Get in Touch</h2>
                    <p className="text-gray-600 mb-8">
                        Have a question about your booking or need help planning your trip? Our team is available 24/7 to assist you.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-skyblue/10 flex items-center justify-center flex-shrink-0">
                                <Phone className="text-brand-skyblue" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Phone</h3>
                                <p className="text-gray-600 mb-1">Mon-Fri from 8am to 5pm</p>
                                <a href="tel:+2348001234567" className="text-brand-orange font-medium hover:underline">+234 800 DREAM VOY</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-skyblue/10 flex items-center justify-center flex-shrink-0">
                                <Mail className="text-brand-skyblue" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Email</h3>
                                <p className="text-gray-600 mb-1">Our friendly team is here to help.</p>
                                <a href="mailto:support@dreamvoyager.com" className="text-brand-orange font-medium hover:underline">support@dreamvoyager.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-skyblue/10 flex items-center justify-center flex-shrink-0">
                                <MapPin className="text-brand-skyblue" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Office</h3>
                                <p className="text-gray-600 mb-1">Come say hello at our office HQ.</p>
                                <p className="text-gray-800 font-medium">123 Travel Street, Lagos, Nigeria</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-skyblue focus:border-brand-skyblue dark:border-gray-600"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-skyblue focus:border-brand-skyblue dark:border-gray-600"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select
                                id="subject"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-skyblue focus:border-brand-skyblue dark:border-gray-600"
                            >
                                <option>General Inquiry</option>
                                <option>Booking Issue</option>
                                <option>Feedback</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-skyblue focus:border-brand-skyblue dark:border-gray-600"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Support;
