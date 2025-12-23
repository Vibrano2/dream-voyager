import { useState } from 'react';
import { Phone, Mail, User, Menu, X, LogOut, ChevronDown, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const TopBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currency, setCurrency] = useState('NGN');
    const { language, setLanguage, t } = useLanguage();
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const currencies = [
        { code: 'NGN', label: '🇳🇬 NGN' },
        { code: 'USD', label: '🇺🇸 USD' },
        { code: 'EUR', label: '🇪🇺 EUR' },
        { code: 'GBP', label: '🇬🇧 GBP' }
    ];

    const languages = [
        { code: 'EN', label: 'English' },
        { code: 'FR', label: 'Français' },
        { code: 'ES', label: 'Español' }
    ];

    return (
        <header className="fixed w-full top-0 z-50 glass-nav transition-all duration-300">
            {/* Top Contact Bar */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 hidden md:block">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                            <Phone size={14} /> +234 800 DREAM VOY
                        </span>
                        <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                            <Mail size={14} /> hello@dreamvoyager.com
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Currency Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                onBlur={() => setTimeout(() => setIsCurrencyOpen(false), 200)}
                                className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none"
                            >
                                {currencies.find(c => c.code === currency)?.label} <ChevronDown size={12} />
                            </button>
                            {isCurrencyOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-white text-slate-800 rounded-lg shadow-xl py-1 w-24 border border-slate-100 animate-in fade-in slide-in-from-top-1 z-50">
                                    {currencies.map(c => (
                                        <button
                                            key={c.code}
                                            onClick={() => { setCurrency(c.code); setIsCurrencyOpen(false); }}
                                            className={`block w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs ${currency === c.code ? 'font-bold text-[#F49129]' : ''}`}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                onBlur={() => setTimeout(() => setIsLangOpen(false), 200)}
                                className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none"
                            >
                                <Globe size={12} /> {language} <ChevronDown size={12} />
                            </button>
                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-white text-slate-800 rounded-lg shadow-xl py-1 w-24 border border-slate-100 animate-in fade-in slide-in-from-top-1 z-50">
                                    {languages.map(l => (
                                        <button
                                            key={l.code}
                                            onClick={() => { setLanguage(l.code as any); setIsLangOpen(false); }}
                                            className={`block w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs ${language === l.code ? 'font-bold text-[#F49129]' : ''}`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <span className="text-slate-600">|</span>
                        <Link to="/login" className="hover:text-white transition-colors">{t('nav.agentLogin')}</Link>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="Dream Voyager"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {[
                            { label: t('nav.flights'), path: '/flights' },
                            { label: t('nav.visas'), path: '/visa' },
                            { label: t('nav.studyVisa'), path: '/study-visa' },
                            { label: t('nav.hotels'), path: '/hotels' },
                            { label: t('nav.packages'), path: '/packages' },
                            { label: t('nav.about'), path: '/about' },
                            { label: 'Corporate', path: '/corporate' },
                            { label: 'Services', path: '/services' }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="text-sm font-medium text-slate-600 hover:text-[#F49129] transition-colors relative group py-2"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F49129] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/my-bookings" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                    {t('nav.myBookings')}
                                </Link>
                                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-skyblue">
                                    <div className="w-8 h-8 rounded-full bg-brand-pale-aqua flex items-center justify-center text-brand-skyblue font-bold border border-brand-skyblue">
                                        {user?.full_name?.charAt(0) || <User size={16} />}
                                    </div>
                                    <span>{user?.full_name?.split(' ')[0] || 'User'}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-500 hover:text-red-500 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                                    <User size={18} />
                                    <span>{t('nav.signIn')}</span>
                                </Link>
                                <Link to="/signup" className="btn-accent text-sm">
                                    {t('nav.getStarted')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Visible on md and below */}
                    <button onClick={toggleMenu} className="lg:hidden text-slate-900">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 flex flex-col animate-in slide-in-from-top-2 duration-200 h-screen overflow-y-auto pb-20">
                    {[
                        { label: t('nav.flights'), path: '/flights' },
                        { label: t('nav.visas'), path: '/visa' },
                        { label: t('nav.studyVisa'), path: '/study-visa' },
                        { label: t('nav.hotels'), path: '/hotels' },
                        { label: t('nav.packages'), path: '/packages' },
                        { label: t('nav.about'), path: '/about' },
                        { label: 'Corporate', path: '/corporate' },
                        { label: 'Services', path: '/services' }
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="px-6 py-4 text-slate-600 hover:bg-slate-50 hover:text-[#F49129] font-medium text-lg border-b border-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Mobile Utility Links */}
                    <div className="px-6 py-4 grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-slate-400 block mb-2">Currency</span>
                            {currencies.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => setCurrency(c.code)}
                                    className={`block text-sm mb-1 ${currency === c.code ? 'text-[#F49129] font-bold' : 'text-slate-600'}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 block mb-2">Language</span>
                            {languages.map(l => (
                                <button
                                    key={l.code}
                                    onClick={() => setLanguage(l.code as any)}
                                    className={`block text-sm mb-1 ${language === l.code ? 'text-[#F49129] font-bold' : 'text-slate-600'}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-2 pt-4 px-6 flex flex-col gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="py-2 text-slate-600 font-medium flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                    <User size={16} /> {t('nav.dashboard')}
                                </Link>
                                <button onClick={handleLogout} className="py-2 text-red-500 font-medium flex items-center gap-2 text-left">
                                    <LogOut size={16} /> {t('nav.signOut')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="py-2 text-slate-600 text-center border border-slate-200 rounded-full" onClick={() => setIsMenuOpen(false)}>{t('nav.signIn')}</Link>
                                <Link to="/signup" className="btn-accent text-center w-full py-3" onClick={() => setIsMenuOpen(false)}>{t('nav.getStarted')}</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default TopBar;
