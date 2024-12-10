import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.adsu.shop',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
    },
});

// Function to get token
const getToken = () => {
    return localStorage.getItem('token');
};

// Update interceptor
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Cookie'] = `SameSite=None; Secure`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Update response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;