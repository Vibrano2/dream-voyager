import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'FR' | 'ES';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple dictionary for demonstration
const translations: Record<Language, Record<string, string>> = {
    EN: {
        'nav.flights': 'Flights',
        'nav.visas': 'Visas',
        'nav.studyVisa': 'Study Visa',
        'nav.hotels': 'Hotels',
        'nav.packages': 'Packages',
        'nav.about': 'About',
        'nav.myBookings': 'My Bookings',
        'nav.signIn': 'Sign In',
        'nav.getStarted': 'Get Started',
        'nav.agentLogin': 'Agent Login',
        'nav.dashboard': 'My Dashboard',
        'nav.signOut': 'Sign Out'
    },
    FR: {
        'nav.flights': 'Vols',
        'nav.visas': 'Visas',
        'nav.studyVisa': 'Visa Étudiant',
        'nav.hotels': 'Hôtels',
        'nav.packages': 'Forfaits',
        'nav.about': 'À Propos',
        'nav.myBookings': 'Mes Réservations',
        'nav.signIn': 'Connexion',
        'nav.getStarted': 'Commencer',
        'nav.agentLogin': 'Connexion Agent',
        'nav.dashboard': 'Mon Tableau de Bord',
        'nav.signOut': 'Déconnexion'
    },
    ES: {
        'nav.flights': 'Vuelos',
        'nav.visas': 'Visas',
        'nav.studyVisa': 'Visa de Estudio',
        'nav.hotels': 'Hoteles',
        'nav.packages': 'Paquetes',
        'nav.about': 'Acerca de',
        'nav.myBookings': 'Mis Reservas',
        'nav.signIn': 'Iniciar Sesión',
        'nav.getStarted': 'Empezar',
        'nav.agentLogin': 'Acceso Agente',
        'nav.dashboard': 'Mi Panel',
        'nav.signOut': 'Cerrar Sesión'
    }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('EN');

    const handleSetLanguage = (lang: Language) => {
        console.log('LanguageContext: changing language to', lang);
        setLanguage(lang);
    };

    const t = (key: string): string => {
        const val = translations[language][key] || key;
        // console.log(`t(${key}) = ${val}`); // Too noisy
        return val;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
