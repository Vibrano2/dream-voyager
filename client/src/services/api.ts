import axios from 'axios';

// Get API URL with production fallback
const getApiUrl = () => {
    // Try environment variable first
    const envUrl = import.meta.env.VITE_API_URL;

    // If environment variable exists, use it
    if (envUrl) {
        console.log('Using API URL from environment:', envUrl);
        return envUrl;
    }

    // Production fallback - hardcoded for reliability
    if (import.meta.env.PROD) {
        console.log('Production mode: Using hardcoded API URL');
        return 'https://dream-voyager-api.onrender.com/api';
    }

    // Development fallback
    console.log('Development mode: Using localhost');
    return 'http://localhost:5000/api';
};

const apiUrl = getApiUrl();

// Create api instance
const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            // Optionally redirect to login, but better handled in Context
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;
