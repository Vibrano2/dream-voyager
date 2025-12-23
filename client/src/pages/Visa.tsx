import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, FileText, CheckCircle2, ArrowRight, Clock, DollarSign, AlertCircle } from 'lucide-react';

interface VisaRequirement {
    item: string;
    required: boolean;
}

interface VisaInfo {
    country: string;
    flag: string;
    processingTime: string;
    fee: string;
    validity: string;
    requirements: VisaRequirement[];
    description: string;
}

const visaData: { [key: string]: VisaInfo } = {
    'uk': {
        country: 'United Kingdom',
        flag: '🇬🇧',
        processingTime: '15-20 business days',
        fee: '₦185,000',
        validity: '6 months',
        requirements: [
            { item: 'Valid passport (min 6 months validity)', required: true },
            { item: 'Completed visa application form', required: true },
            { item: 'Recent passport photographs (2)', required: true },
            { item: 'Proof of accommodation', required: true },
            { item: 'Flight itinerary', required: true },
            { item: 'Bank statements (last 6 months)', required: true },
            { item: 'Employment letter', required: true },
            { item: 'Travel insurance', required: true },
        ],
        description: 'UK visitor visa for tourism, business, or visiting family and friends.'
    },
    'usa': {
        country: 'United States',
        flag: '🇺🇸',
        processingTime: '10-15 business days',
        fee: '₦220,000',
        validity: '10 years (multiple entry)',
        requirements: [
            { item: 'Valid passport (min 6 months validity)', required: true },
            { item: 'DS-160 confirmation page', required: true },
            { item: 'Recent passport photographs (2)', required: true },
            { item: 'Interview appointment confirmation', required: true },
            { item: 'Bank statements (last 6 months)', required: true },
            { item: 'Employment letter', required: true },
            { item: 'Previous travel history', required: false },
            { item: 'Property documents', required: false },
        ],
        description: 'US B1/B2 tourist and business visa with interview requirement.'
    },
    'canada': {
        country: 'Canada',
        flag: '🇨🇦',
        processingTime: '20-25 business days',
        fee: '₦165,000',
        validity: '10 years (multiple entry)',
        requirements: [
            { item: 'Valid passport (min 6 months validity)', required: true },
            { item: 'Completed application form', required: true },
            { item: 'Recent passport photographs (2)', required: true },
            { item: 'Proof of funds', required: true },
            { item: 'Travel itinerary', required: true },
            { item: 'Employment letter', required: true },
            { item: 'Biometrics appointment', required: true },
            { item: 'Purpose of visit letter', required: true },
        ],
        description: 'Canadian visitor visa (TRV) for tourism and business purposes.'
    },
    'schengen': {
        country: 'Schengen Area',
        flag: '🇪🇺',
        processingTime: '15-20 business days',
        fee: '₦145,000',
        validity: '90 days (within 180 days)',
        requirements: [
            { item: 'Valid passport (min 3 months beyond stay)', required: true },
            { item: 'Completed application form', required: true },
            { item: 'Recent passport photographs (2)', required: true },
            { item: 'Travel insurance (min €30,000 coverage)', required: true },
            { item: 'Flight reservation', required: true },
            { item: 'Hotel bookings', required: true },
            { item: 'Bank statements (last 3 months)', required: true },
            { item: 'Cover letter', required: true },
        ],
        description: 'Schengen visa for travel to 27 European countries.'
    },
    'dubai': {
        country: 'Dubai/UAE',
        flag: '🇦🇪',
        processingTime: '3-5 business days',
        fee: '₦95,000',
        validity: '30 days',
        requirements: [
            { item: 'Valid passport (min 6 months validity)', required: true },
            { item: 'Passport copy (bio-data page)', required: true },
            { item: 'Recent passport photograph', required: true },
            { item: 'Flight tickets', required: true },
            { item: 'Hotel reservation', required: true },
            { item: 'Bank statement (last month)', required: false },
        ],
        description: 'UAE tourist visa with fast processing time.'
    }
};

const Visa = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [showRequirements, setShowRequirements] = useState(false);

    const handleCountrySelect = (country: string) => {
        setSelectedCountry(country);
        setShowRequirements(true);
    };

    const selectedVisa = selectedCountry ? visaData[selectedCountry] : null;

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1920"
                        alt="Visa"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8] rounded-full filter blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F49129] rounded-full filter blur-[120px] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Globe size={20} className="text-[#F49129]" />
                            <span className="font-semibold">Visa Assistance</span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                            Visa Application Made Easy
                        </h1>
                        <p className="text-lg text-slate-300 mb-8">
                            Select your destination country to view requirements and start your visa application
                        </p>
                    </div>
                </div>
            </div>

            {/* Country Selection */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-heading text-3xl font-bold text-center mb-4">Select Your Destination</h2>
                    <p className="text-center text-slate-600 mb-12">Choose the country you want to apply for a visa</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {Object.entries(visaData).map(([key, visa]) => (
                            <button
                                key={key}
                                onClick={() => handleCountrySelect(key)}
                                className={`bg-white p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left ${selectedCountry === key ? 'border-[#F49129] ring-4 ring-[#F49129]/20' : 'border-slate-100 hover:border-[#F49129]'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-5xl">{visa.flag}</div>
                                    <div>
                                        <h3 className="font-heading text-xl font-bold">{visa.country}</h3>
                                        <p className="text-sm text-slate-500">Tourist Visa</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock size={16} className="text-[#F49129]" />
                                        <span>{visa.processingTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <DollarSign size={16} className="text-[#F49129]" />
                                        <span className="font-bold text-slate-900">{visa.fee}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Requirements Section */}
                    {showRequirements && selectedVisa && (
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
                            <div className="bg-gradient-to-r from-[#F49129] to-[#d67a1f] text-white p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-6xl">{selectedVisa.flag}</div>
                                    <div>
                                        <h2 className="font-heading text-3xl font-bold mb-2">{selectedVisa.country} Visa Requirements</h2>
                                        <p className="text-white/90">{selectedVisa.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={20} />
                                            <span className="font-semibold">Processing Time</span>
                                        </div>
                                        <p className="text-white/90">{selectedVisa.processingTime}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign size={20} />
                                            <span className="font-semibold">Visa Fee</span>
                                        </div>
                                        <p className="text-white/90 text-xl font-bold">{selectedVisa.fee}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText size={20} />
                                            <span className="font-semibold">Validity</span>
                                        </div>
                                        <p className="text-white/90">{selectedVisa.validity}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                                    <FileText size={24} className="text-[#F49129]" />
                                    Required Documents
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {selectedVisa.requirements.map((req, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            {req.required ? (
                                                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="font-semibold text-slate-900">{req.item}</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {req.required ? 'Required' : 'Optional'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={24} className="text-blue-600 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-blue-900 mb-2">Important Information</h4>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                                <li>• All documents must be original or certified copies</li>
                                                <li>• Bank statements should show sufficient funds for your trip</li>
                                                <li>• Processing time may vary based on embassy workload</li>
                                                <li>• We provide full assistance with document preparation and submission</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate('/book', {
                                            state: {
                                                packageTitle: `${selectedVisa.country} Visa Application`,
                                                packagePrice: parseInt(selectedVisa.fee.replace(/[^\d]/g, '')),
                                                packageLocation: selectedVisa.country,
                                                bookingType: 'visa'
                                            }
                                        })}
                                        className="flex-1 btn-accent text-lg py-4 flex items-center justify-center gap-3"
                                    >
                                        <FileText size={22} />
                                        Start Application
                                        <ArrowRight size={22} />
                                    </button>
                                    <button className="px-8 py-4 rounded-full border-2 border-slate-200 hover:border-[#F49129] transition-colors font-semibold text-slate-700 hover:text-[#F49129]">
                                        <Link to="/support" className="w-full btn-outline flex items-center justify-center mt-4">Contact Support</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-slate-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Choose Our Visa Services?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We make the visa application process simple and stress-free
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">High Success Rate</h3>
                            <p className="text-sm text-slate-600">95% approval rate</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#F49129] to-[#d67a1f] rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FileText size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Document Review</h3>
                            <p className="text-sm text-slate-600">Expert verification</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Clock size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Fast Processing</h3>
                            <p className="text-sm text-slate-600">Quick turnaround</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Globe size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Global Coverage</h3>
                            <p className="text-sm text-slate-600">100+ countries</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visa;
