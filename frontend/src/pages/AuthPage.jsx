import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, Sun, Moon, TrendingUp, Shield, Target, Sparkles } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const { login, signup } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (!formData.name) {
                    setError('Please enter your full name');
                    setLoading(false);
                    return;
                }
                await signup(formData.name, formData.email, formData.password);
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
        }
        setLoading(false);
    };

    const features = [
        { icon: <TrendingUp className="w-6 h-6" />, title: 'Smart Analytics', desc: 'AI-powered financial insights' },
        { icon: <Shield className="w-6 h-6" />, title: 'Health Score', desc: 'Track your financial wellness' },
        { icon: <Target className="w-6 h-6" />, title: 'Goal Planning', desc: 'Achieve your dreams faster' },
        { icon: <Sparkles className="w-6 h-6" />, title: 'AI Advisor', desc: 'Personal finance mentor' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated gradient background */}
            <div className={`absolute inset-0 ${theme === 'dark' ? 'animated-gradient' : 'animated-gradient-light'}`} />

            {/* Decorative orbs */}
            <div className="orb w-72 h-72 bg-primary-500 top-10 -left-20" style={{ animationDelay: '0s' }} />
            <div className="orb w-96 h-96 bg-accent-500 -bottom-20 right-10" style={{ animationDelay: '2s' }} />
            <div className="orb w-64 h-64 bg-purple-500 top-1/2 left-1/3" style={{ animationDelay: '4s' }} />

            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 z-50 p-3 rounded-xl glass hover:scale-110 transition-all duration-300"
                id="theme-toggle-auth"
            >
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                    <Moon className="w-5 h-5 text-primary-700" />
                )}
            </button>

            {/* Main container */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 max-w-6xl w-full animate-fade-in">
                {/* Left side - Branding */}
                <div className="flex-1 text-center lg:text-left space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center lg:justify-start gap-3 animate-slide-up">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-4xl font-heading font-bold text-white dark:text-white">
                                Wealth<span className="gradient-text">Bridge</span>
                            </h1>
                        </div>
                        <p className="text-lg text-white/70 dark:text-white/60 max-w-md mx-auto lg:mx-0 font-body animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Your intelligent financial mentor for smarter money decisions every day.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="glass rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-default animate-slide-up"
                                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                            >
                                <div className="text-primary-300 mb-2">{feature.icon}</div>
                                <h3 className="text-white font-semibold text-sm font-heading">{feature.title}</h3>
                                <p className="text-white/50 text-xs mt-1">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side - Auth Card */}
                <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className={`${theme === 'dark' ? 'glass-dark' : 'glass'} rounded-3xl p-8 space-y-6`}>
                        {/* Toggle tabs */}
                        <div className="flex bg-white/10 rounded-xl p-1">
                            <button
                                onClick={() => { setIsLogin(true); setError(''); }}
                                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${isLogin
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                                        : 'text-white/60 hover:text-white'
                                    }`}
                                id="login-tab"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(''); }}
                                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${!isLogin
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                                        : 'text-white/60 hover:text-white'
                                    }`}
                                id="signup-tab"
                            >
                                Sign Up
                            </button>
                        </div>

                        <div>
                            <h2 className="text-2xl font-heading font-bold text-white">
                                {isLogin ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="text-white/50 text-sm mt-1">
                                {isLogin ? 'Sign in to access your financial dashboard' : 'Start your journey to financial wellness'}
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm animate-slide-up">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="relative animate-slide-up">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300"
                                        id="signup-name"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300"
                                    id="auth-email"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300"
                                    id="auth-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {!isLogin && (
                                <div className="relative animate-slide-up">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300"
                                        id="signup-confirm-password"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
                                id="auth-submit"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <Sparkles className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/20" />
                            <span className="text-white/40 text-xs">OR</span>
                            <div className="flex-1 h-px bg-white/20" />
                        </div>

                        {/* Google OAuth */}
                        <button
                            className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-3 transition-all duration-300"
                            id="google-auth"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        {isLogin && (
                            <p className="text-center text-white/40 text-sm">
                                Forgot your password?{' '}
                                <button className="text-primary-400 hover:text-primary-300 transition-colors">Reset here</button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
