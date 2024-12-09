import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.adsu.shop',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Function to get token
const getToken = () => {
    // First try localStorage
    const localToken = localStorage.getItem('authToken');
    if (localToken) {
        return localToken;
    }

    // Then try cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
        const token = decodeURIComponent(tokenCookie.split('=')[1]);
        // Store in localStorage for future use
        localStorage.setItem('authToken', token);
        return token;
    }

    return null;
};

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Token found and added to request headers');
        } else {
            console.log('No token found');
        }

        // Log the final headers being sent (remove in production)
        console.log('Request headers:', config.headers);
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Handle 401 and 500 errors
        if (error.response?.status === 401 || error.response?.status === 500) {
            // Clear all auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;