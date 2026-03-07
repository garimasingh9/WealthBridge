import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutList, ArrowRight } from 'lucide-react';

export default function RequiresProfile({ children, icon: Icon = LayoutList, title = "Complete Your Profile", description = "We need your basic financial details to unlock this feature and provide personalized recommendations." }) {
    const { financialData } = useAuth();

    if (financialData.monthlyIncome > 0 && financialData.monthlyExpenses > 0) {
        return children;
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-800 dark:to-dark-900 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-primary-500/10 border border-primary-100/50 dark:border-dark-700">
                <Icon className="w-12 h-12 text-primary-500" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-dark-900 dark:text-white mb-4">{title}</h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-lg mx-auto mb-10 text-lg leading-relaxed">{description}</p>
            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4 shadow-xl shadow-primary-500/20">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
    );
}
