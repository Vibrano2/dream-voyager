import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Globe, BookOpen, FileText, ArrowRight, CheckCircle2, Clock, DollarSign, Users, Building2 } from 'lucide-react';

interface University {
    name: string;
    location: string;
    ranking: string;
    logo: string;
}

interface Course {
    name: string;
    duration: string;
    intake: string;
}

interface StudyDestination {
    country: string;
    flag: string;
    description: string;
    universities: University[];
    popularCourses: Course[];
    visaFee: string;
    processingTime: string;
    requirements: string[];
}

const studyDestinations: { [key: string]: StudyDestination } = {
    'uk': {
        country: 'United Kingdom',
        flag: '🇬🇧',
        description: 'World-class education with prestigious universities and diverse culture',
        universities: [
            { name: 'University of Oxford', location: 'Oxford', ranking: '#1 UK', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=100' },
            { name: 'University of Cambridge', location: 'Cambridge', ranking: '#2 UK', logo: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=100' },
            { name: 'Imperial College London', location: 'London', ranking: '#3 UK', logo: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&q=80&w=100' },
            { name: 'University College London', location: 'London', ranking: '#4 UK', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=100' },
        ],
        popularCourses: [
            { name: 'MSc Computer Science', duration: '1 year', intake: 'Sep 2024' },
            { name: 'MBA', duration: '1-2 years', intake: 'Sep 2024' },
            { name: 'MSc Data Science', duration: '1 year', intake: 'Sep 2024' },
            { name: 'LLM Law', duration: '1 year', intake: 'Sep 2024' },
        ],
        visaFee: '₦520,000',
        processingTime: '3-4 weeks',
        requirements: [
            'Valid passport',
            'Admission letter (CAS)',
            'Proof of funds (tuition + living expenses)',
            'English proficiency (IELTS/TOEFL)',
            'Academic transcripts',
            'TB test certificate',
            'Visa application form',
            'Biometric appointment'
        ]
    },
    'usa': {
        country: 'United States',
        flag: '🇺🇸',
        description: 'Innovative education system with cutting-edge research opportunities',
        universities: [
            { name: 'Harvard University', location: 'Massachusetts', ranking: '#1 USA', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=100' },
            { name: 'Stanford University', location: 'California', ranking: '#2 USA', logo: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=100' },
            { name: 'MIT', location: 'Massachusetts', ranking: '#3 USA', logo: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&q=80&w=100' },
            { name: 'Yale University', location: 'Connecticut', ranking: '#4 USA', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=100' },
        ],
        popularCourses: [
            { name: 'MS Computer Science', duration: '2 years', intake: 'Fall 2024' },
            { name: 'MBA', duration: '2 years', intake: 'Fall 2024' },
            { name: 'MS Engineering', duration: '2 years', intake: 'Fall 2024' },
            { name: 'MS Data Analytics', duration: '1.5 years', intake: 'Fall 2024' },
        ],
        visaFee: '₦285,000',
        processingTime: '2-3 weeks',
        requirements: [
            'Valid passport',
            'I-20 form from university',
            'SEVIS fee payment',
            'Proof of financial support',
            'Academic documents',
            'English proficiency (TOEFL/IELTS)',
            'Visa interview appointment',
            'DS-160 confirmation'
        ]
    },
    'canada': {
        country: 'Canada',
        flag: '🇨🇦',
        description: 'High-quality education with post-study work opportunities',
        universities: [
            { name: 'University of Toronto', location: 'Toronto', ranking: '#1 Canada', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=100' },
            { name: 'McGill University', location: 'Montreal', ranking: '#2 Canada', logo: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=100' },
            { name: 'UBC', location: 'Vancouver', ranking: '#3 Canada', logo: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&q=80&w=100' },
            { name: 'University of Waterloo', location: 'Waterloo', ranking: '#4 Canada', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=100' },
        ],
        popularCourses: [
            { name: 'MSc Computer Science', duration: '2 years', intake: 'Sep 2024' },
            { name: 'MBA', duration: '2 years', intake: 'Sep 2024' },
            { name: 'MEng Engineering', duration: '1.5 years', intake: 'Sep 2024' },
            { name: 'MSc Business Analytics', duration: '1 year', intake: 'Sep 2024' },
        ],
        visaFee: '₦225,000',
        processingTime: '4-6 weeks',
        requirements: [
            'Valid passport',
            'Letter of acceptance',
            'Proof of funds',
            'English proficiency (IELTS/TOEFL)',
            'Academic transcripts',
            'Statement of purpose',
            'Biometrics',
            'Medical examination'
        ]
    },
    'australia': {
        country: 'Australia',
        flag: '🇦🇺',
        description: 'World-renowned universities with excellent student support',
        universities: [
            { name: 'University of Melbourne', location: 'Melbourne', ranking: '#1 Australia', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=100' },
            { name: 'Australian National University', location: 'Canberra', ranking: '#2 Australia', logo: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=100' },
            { name: 'University of Sydney', location: 'Sydney', ranking: '#3 Australia', logo: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&q=80&w=100' },
            { name: 'UNSW Sydney', location: 'Sydney', ranking: '#4 Australia', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=100' },
        ],
        popularCourses: [
            { name: 'Master of IT', duration: '2 years', intake: 'Feb/Jul 2024' },
            { name: 'MBA', duration: '1.5-2 years', intake: 'Feb/Jul 2024' },
            { name: 'Master of Engineering', duration: '2 years', intake: 'Feb/Jul 2024' },
            { name: 'Master of Data Science', duration: '2 years', intake: 'Feb/Jul 2024' },
        ],
        visaFee: '₦395,000',
        processingTime: '4-8 weeks',
        requirements: [
            'Valid passport',
            'CoE (Confirmation of Enrollment)',
            'Proof of funds',
            'English proficiency (IELTS/PTE)',
            'Academic documents',
            'Overseas Student Health Cover',
            'GTE statement',
            'Health examination'
        ]
    }
};

const StudyVisa = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [showDetails, setShowDetails] = useState(false);

    const handleCountrySelect = (country: string) => {
        setSelectedCountry(country);
        setShowDetails(true);
    };

    const selectedDestination = selectedCountry ? studyDestinations[selectedCountry] : null;

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920"
                        alt="Study"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8] rounded-full filter blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F49129] rounded-full filter blur-[120px] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <GraduationCap size={20} className="text-[#F49129]" />
                            <span className="font-semibold">Study Abroad</span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                            Your Gateway to Global Education
                        </h1>
                        <p className="text-lg text-slate-300 mb-8">
                            Explore top universities, courses, and visa requirements for your dream destination
                        </p>
                    </div>
                </div>
            </div>

            {/* Country Selection */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-heading text-3xl font-bold text-center mb-4">Choose Your Study Destination</h2>
                    <p className="text-center text-slate-600 mb-12">Select a country to explore universities and courses</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {Object.entries(studyDestinations).map(([key, destination]) => (
                            <button
                                key={key}
                                onClick={() => handleCountrySelect(key)}
                                className={`bg-white p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${selectedCountry === key ? 'border-[#F49129] ring-4 ring-[#F49129]/20' : 'border-slate-100 hover:border-[#F49129]'
                                    }`}
                            >
                                <div className="text-6xl mb-4 text-center">{destination.flag}</div>
                                <h3 className="font-heading text-xl font-bold text-center mb-2">{destination.country}</h3>
                                <p className="text-sm text-slate-600 text-center">{destination.description}</p>
                            </button>
                        ))}
                    </div>

                    {/* Destination Details */}
                    {showDetails && selectedDestination && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Overview */}
                            <div className="bg-gradient-to-r from-[#F49129] to-[#d67a1f] text-white rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-6xl">{selectedDestination.flag}</div>
                                    <div>
                                        <h2 className="font-heading text-3xl font-bold mb-2">Study in {selectedDestination.country}</h2>
                                        <p className="text-white/90">{selectedDestination.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign size={20} />
                                            <span className="font-semibold">Student Visa Fee</span>
                                        </div>
                                        <p className="text-white/90 text-xl font-bold">{selectedDestination.visaFee}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={20} />
                                            <span className="font-semibold">Processing Time</span>
                                        </div>
                                        <p className="text-white/90">{selectedDestination.processingTime}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Universities */}
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
                                <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Building2 size={24} className="text-[#F49129]" />
                                    Top Universities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedDestination.universities.map((uni, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#F49129] transition-colors">
                                            <img src={uni.logo} alt={uni.name} className="w-16 h-16 rounded-xl object-cover" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg">{uni.name}</h4>
                                                <p className="text-sm text-slate-600">{uni.location}</p>
                                                <span className="inline-block mt-1 text-xs bg-[#F49129] text-white px-2 py-1 rounded-full">
                                                    {uni.ranking}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Courses */}
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
                                <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                                    <BookOpen size={24} className="text-[#F49129]" />
                                    Popular Courses
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedDestination.popularCourses.map((course, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <h4 className="font-bold text-lg mb-2">{course.name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} className="text-[#F49129]" />
                                                    {course.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} className="text-[#F49129]" />
                                                    {course.intake}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visa Requirements */}
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
                                <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                                    <FileText size={24} className="text-[#F49129]" />
                                    Student Visa Requirements
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {selectedDestination.requirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                                            <span className="font-medium text-slate-900">{req}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate('/book', {
                                            state: {
                                                packageTitle: `Study in ${selectedDestination.country}`,
                                                packagePrice: parseInt(selectedDestination.visaFee.replace(/[^\d]/g, '')),
                                                packageLocation: selectedDestination.country,
                                                bookingType: 'study-visa'
                                            }
                                        })}
                                        className="flex-1 btn-accent text-lg py-4 flex items-center justify-center gap-3"
                                    >
                                        <GraduationCap size={22} />
                                        Start Application
                                        <ArrowRight size={22} />
                                    </button>
                                    <button className="px-8 py-4 rounded-full border-2 border-slate-200 hover:border-[#F49129] transition-colors font-semibold text-slate-700 hover:text-[#F49129]">
                                        Schedule Consultation
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Services */}
            <div className="bg-slate-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Study Abroad Services</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Complete support from university selection to visa approval
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Globe size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">University Selection</h3>
                            <p className="text-sm text-slate-600">Expert guidance on choosing the right university</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#F49129] to-[#d67a1f] rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FileText size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Application Support</h3>
                            <p className="text-sm text-slate-600">Complete assistance with applications</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Visa Processing</h3>
                            <p className="text-sm text-slate-600">End-to-end visa application help</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Users size={28} className="text-white" />
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-2">Pre-Departure</h3>
                            <p className="text-sm text-slate-600">Orientation and travel assistance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyVisa;
