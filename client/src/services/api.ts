import axios from 'axios';

// Get API URL from environment variable
const apiUrl = import.meta.env.VITE_API_URL;

// Validate API URL is set
if (!apiUrl) {
    console.error('VITE_API_URL is not set. Please check your environment variables.');
}

// Create api instance
const api = axios.create({
    baseURL: apiUrl || 'http://localhost:5000/api', // Fallback for development only
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
