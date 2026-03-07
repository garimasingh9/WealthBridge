import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard, Target, Heart, Shield, PiggyBank,
    Calculator, Umbrella, BarChart3, ShoppingBag, MessageCircle,
    Map, FileText, LogOut, Sun, Moon, Menu, X, TrendingUp, ChevronRight
} from 'lucide-react';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/goals', icon: Target, label: 'Financial Goals' },
    { path: '/health-score', icon: Heart, label: 'Health Score' },
    { path: '/emergency-fund', icon: Shield, label: 'Emergency Fund' },
    { path: '/saving-strategy', icon: PiggyBank, label: 'Saving Strategy' },
    { path: '/life-simulator', icon: Calculator, label: 'Life Simulator' },
    { path: '/insurance', icon: Umbrella, label: 'Insurance' },
    { path: '/habit-analyzer', icon: BarChart3, label: 'Habit Analyzer' },
    { path: '/ask-before-buy', icon: ShoppingBag, label: 'Ask Before Buy' },
    { path: '/ai-advisor', icon: MessageCircle, label: 'AI Advisor' },
    { path: '/roadmap', icon: Map, label: 'Roadmap' },
    { path: '/monthly-report', icon: FileText, label: 'Monthly Report' },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } flex flex-col`}>
                {/* Logo */}
                <div className="p-6 border-b border-dark-100 dark:border-dark-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-heading font-bold text-dark-900 dark:text-white">
                                Wealth<span className="gradient-text">Bridge</span>
                            </h1>
                            <p className="text-xs text-dark-400 dark:text-dark-500">Financial Mentor</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>

                {/* User info & logout */}
                <div className="p-4 border-t border-dark-100 dark:border-dark-800">
                    <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-primary-50/50 dark:bg-primary-500/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-dark-400 truncate">{user?.email || 'user@email.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full sidebar-item text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"
                        id="logout-btn"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Top bar */}
                <header className="h-16 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-100 dark:border-dark-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                        id="mobile-menu-btn"
                    >
                        <Menu className="w-6 h-6 text-dark-600 dark:text-dark-300" />
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-dark-100/50 dark:bg-dark-800/50 hover:bg-dark-200 dark:hover:bg-dark-700 transition-all duration-300 group"
                            id="theme-toggle"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-primary-600 group-hover:-rotate-12 transition-transform duration-500" />
                            )}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
