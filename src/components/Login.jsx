import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (token && isAuthenticated === 'true') {
            navigate('/edit-header', { replace: true });
        }
    }, []);

    const handleChange = (e) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading || isSuccess) return;
        
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/login', credentials);

            if (response.data.success) {
                setIsSuccess(true);
                const { token, user } = response.data;
                
                // Store authentication data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('isAuthenticated', 'true');

                // Set token in axios defaults
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Use requestAnimationFrame for smoother navigation
                requestAnimationFrame(() => {
                    // Small delay to ensure state updates are complete
                    setTimeout(() => {
                        navigate('/edit-header', { replace: true });
                    }, 100);
                });
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'An error occurred');
            setIsSuccess(false);
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
                            disabled={loading || isSuccess}
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
                            disabled={loading || isSuccess}
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || isSuccess}
                        className={`w-full py-2 px-4 rounded ${
                            loading || isSuccess
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    >
                        {loading ? 'Logging in...' : isSuccess ? 'Redirecting...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
