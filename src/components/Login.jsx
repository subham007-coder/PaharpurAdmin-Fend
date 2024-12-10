import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check authentication status only once on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const isAuthenticated = localStorage.getItem('isAuthenticated');
            
            if (token && isAuthenticated === 'true') {
                // Set axios default header
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Verify token validity with backend
                try {
                    await api.get('/api/auth/verify');
                    navigate('/edit-header', { replace: true });
                } catch (err) {
                    // Clear invalid auth data
                    localStorage.clear();
                }
            }
        };

        checkAuth();
    }, []); // Empty dependency array

    const handleChange = (e) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;
        
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/login', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Credentials': 'true'
                },
                withCredentials: true
            });

            if (response.data.success) {
                const { token, user } = response.data;
                
                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('isAuthenticated', 'true');

                // Set token in axios defaults
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Navigate to dashboard
                navigate('/edit-header', { replace: true });
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Admin Login</h2>
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded ${
                            loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
