import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.adsu.shop',
    withCredentials: true, // Enable sending cookies with requests
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for common headers
api.interceptors.request.use(
    (config) => {
        // No need to manually set Authorization header as cookies will be sent automatically
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            console.error('Authentication error:', error);
            // You might want to redirect to login page here
            // window.location.href = '/login';
        } else if (error.response?.status === 500) {
            console.error('Server error:', error);
        }
        return Promise.reject(error);
    }
);

export default api;