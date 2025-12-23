
const Cookies = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-heading font-bold mb-6">Cookie Policy</h1>
            <div className="prose max-w-none text-gray-700">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p className="mt-4">
                    This Cookie Policy explains how Dream Voyager uses cookies and similar technologies to recognize you when you visit our website.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-3">1. What are cookies?</h2>
                <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website.</p>

                <h2 className="text-xl font-bold mt-6 mb-3">2. How we use cookies</h2>
                <p>We use cookies to understand how you interact with our website, to keep you signed in, and to save your preferences.</p>
            </div>
        </div>
    );
};

export default Cookies;
