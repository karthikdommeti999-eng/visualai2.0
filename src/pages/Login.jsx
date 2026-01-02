import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Mail, Lock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, socialLogin, handleGoogleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/dashboard'); // Redirect to dashboard after login
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const loginWithSocial = async (provider) => {
        try {
            await socialLogin(provider);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to login with ' + provider);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-dark-800 border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to Karthik's Platform</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-500/20 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-teal text-white placeholder-gray-600 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-teal text-white placeholder-gray-600 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button className="w-full shadow-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-dark-800 px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        await handleGoogleLogin(credentialResponse);
                                        navigate('/dashboard');
                                    } catch (err) {
                                        console.error(err);
                                        setError('Google Login Failed');
                                    }
                                }}
                                onError={() => {
                                    setError('Google Login Failed');
                                }}
                                theme="filled_black"
                                shape="pill"
                                width="300"
                            />
                        </div>

                        {/* Facebook (Still Mock) */}
                        <button
                            type="button"
                            onClick={() => loginWithSocial('facebook')}
                            className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2 rounded-xl hover:bg-[#1864D9] transition-colors font-medium text-sm w-full max-w-[300px] mx-auto"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? {' '}
                    <Link to="/signup" className="text-brand-teal hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};
