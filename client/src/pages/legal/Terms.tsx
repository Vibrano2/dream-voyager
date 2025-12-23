
const Terms = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-heading font-bold mb-6">Terms of Service</h1>
            <div className="prose max-w-none text-gray-700">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p className="mt-4">
                    Please read these Terms of Service carefully before using the Dream Voyager website and services.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using our service, you agree to be bound by these terms.</p>

                <h2 className="text-xl font-bold mt-6 mb-3">2. Bookings and Payments</h2>
                <p>All bookings are subject to availability and confirmation. Payments must be made in full according to the specified terms.</p>

                <h2 className="text-xl font-bold mt-6 mb-3">3. Cancellations</h2>
                <p>Cancellation policies vary by booking type. Please review specific package terms.</p>
            </div>
        </div>
    );
};

export default Terms;
