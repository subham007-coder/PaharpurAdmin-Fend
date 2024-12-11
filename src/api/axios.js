import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.adsu.shop',
    withCredentials: true,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

// Function to get token
const getToken = () => {
    return localStorage.getItem('token');
};

// Simplified interceptor that only sets the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Remove any cookie-related configurations from headers
        delete config.headers['Cookie'];
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;