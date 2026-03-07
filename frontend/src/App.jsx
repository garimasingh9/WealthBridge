import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import HealthScore from './pages/HealthScore';
import EmergencyFund from './pages/EmergencyFund';
import SavingStrategy from './pages/SavingStrategy';
import LifeSimulator from './pages/LifeSimulator';
import Insurance from './pages/Insurance';
import HabitAnalyzer from './pages/HabitAnalyzer';
import AskBeforeYouBuy from './pages/AskBeforeYouBuy';
import AIAdvisor from './pages/AIAdvisor';
import Roadmap from './pages/Roadmap';
import MonthlyReport from './pages/MonthlyReport';
import RequiresProfile from './components/RequiresProfile';
import {
    HeartPulse, ShieldAlert, PiggyBank, Compass,
    ShieldCheck, BarChart3, ShoppingBag, Map, CalendarClock
} from 'lucide-react';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth" />;
}

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="goals" element={<Goals />} />
                <Route path="health-score" element={
                    <RequiresProfile icon={HeartPulse} title="Calculate Your Health Score" description="Enter your monthly income and expenses to check your financial health score and get an actionable plan.">
                        <HealthScore />
                    </RequiresProfile>
                } />
                <Route path="emergency-fund" element={
                    <RequiresProfile icon={ShieldAlert} title="Plan Your Emergency Fund" description="We need to know your monthly expenses to calculate the ideal size for your emergency safety net.">
                        <EmergencyFund />
                    </RequiresProfile>
                } />
                <Route path="saving-strategy" element={
                    <RequiresProfile icon={PiggyBank} title="Find Your Saving Strategy" description="Provide your income and expenses so we can match you with the best savings methodology for your lifestyle.">
                        <SavingStrategy />
                    </RequiresProfile>
                } />
                <Route path="life-simulator" element={
                    <RequiresProfile icon={Compass} title="Simulate Life Scenarios" description="Enter your financial profile to accurately simulate how major life decisions will impact your wealth.">
                        <LifeSimulator />
                    </RequiresProfile>
                } />
                <Route path="insurance" element={
                    <RequiresProfile icon={ShieldCheck} title="Get Insurance Recommendations" description="Tell us about your income and savings so we can recommend the right insurance coverage for your family.">
                        <Insurance />
                    </RequiresProfile>
                } />
                <Route path="habit-analyzer" element={
                    <RequiresProfile icon={BarChart3} title="Unlock the Habit Analyzer" description="We need your basic financial details to analyze your spending habits and provide personalized budget recommendations.">
                        <HabitAnalyzer />
                    </RequiresProfile>
                } />
                <Route path="ask-before-buy" element={
                    <RequiresProfile icon={ShoppingBag} title="Enable Purchase Analysis" description="Set up your profile to let us calculate how long it will take to recover from a major purchase.">
                        <AskBeforeYouBuy />
                    </RequiresProfile>
                } />
                <Route path="ai-advisor" element={<AIAdvisor />} />
                <Route path="roadmap" element={
                    <RequiresProfile icon={Map} title="Generate Your Financial Roadmap" description="Enter your financial data so we can project your 10-year wealth-building journey step by step.">
                        <Roadmap />
                    </RequiresProfile>
                } />
                <Route path="monthly-report" element={
                    <RequiresProfile icon={CalendarClock} title="View Your Monthly Report" description="Complete your financial profile to automatically generate your detailed monthly performance report.">
                        <MonthlyReport />
                    </RequiresProfile>
                } />
            </Route>
            <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}
