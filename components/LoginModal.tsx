

import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { userService } from '../services/userService';
import type { Page } from '../App';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // First, check for a regular user
            const userToLogin = await userService.getUserByEmail(email);

            if (userToLogin) {
                // In a real app, you'd verify the password against a hash.
                login(userToLogin);
                onClose();
                return;
            }
            
            // If no regular user, check if they are a trustee
            const trusteeToLogin = await userService.getTrusteeLogin(email);
            if (trusteeToLogin) {
                login(trusteeToLogin);
                onClose();
                return;
            }

            // If neither, show error
            setError('No user or trustee found with that email address.');
        } catch (err) {
            console.error("Login error:", err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-800">Sign In</h2>
                        <p className="mt-2 text-slate-500">Welcome back! Please enter your details.</p>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">Email address</label>
                        <div className="mt-1">
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="login-password"className="block text-sm font-medium text-slate-700">Password</label>
                        <div className="mt-1">
                            <input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-slate-400"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        <p className="text-slate-500">
                            Don't have an account? <button type="button" onClick={() => alert('Redirect to sign-up page.')} className="font-medium text-teal-600 hover:text-teal-500">Sign Up</button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
