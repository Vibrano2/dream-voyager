
const Privacy = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-heading font-bold mb-6">Privacy Policy</h1>
            <div className="prose max-w-none text-gray-700">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p className="mt-4">
                    At Dream Voyager, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-3">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact support.</p>

                <h2 className="text-xl font-bold mt-6 mb-3">2. How We Use Your Information</h2>
                <p>We use your information to facilitate your travel bookings, communicate with you, and improve our services.</p>

                <h2 className="text-xl font-bold mt-6 mb-3">3. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at hello@dreamvoyager.com.</p>
            </div>
        </div>
    );
};

export default Privacy;
