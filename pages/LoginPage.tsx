import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight, Loader, Eye, EyeOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/'); // Redirect to home on success
            } else {
                // Sign Up
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                // For Supabase, usually you need to verify email, but we'll assume auto-confirm or just close
                alert('Account created! Please check your email for verification.');
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Modal-like Card */}
            <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">

                {/* Back Button (X) */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pt-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-display font-bold text-black tracking-tighter mb-4">
                            INSPOFASHIONS
                        </h1>
                        <h2 className="text-3xl font-display font-bold mb-2">
                            {isLogin ? 'Welcome Back.' : 'Join the Club.'}
                        </h2>
                        <p className="text-gray-500">
                            {isLogin ? 'Sign in to access your saved items and orders.' : 'Create an account to unlock exclusive perks.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!isLogin && (
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl py-3 pl-12 pr-4 outline-none transition-all"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl py-3 pl-12 pr-4 outline-none transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl py-3 pl-12 pr-12 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-px bg-gray-100 flex-1" />
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Or continue with</span>
                        <div className="h-px bg-gray-100 flex-1" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="mt-6 w-full bg-white border border-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Google</span>
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-bold text-black hover:underline underline-offset-2"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>

                    <div className="mt-6 text-center border-t border-gray-100 pt-6">
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="text-xs font-semibold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
                        >
                            Admin Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
