import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AuthContext = createContext();

const INITIAL_FINANCIAL_DATA = {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    savingsRate: 0,
    emergencyFund: 0,
    investments: 0,
    expenseBreakdown: [],
    monthlyTrend: [],
    goals: [],
    spendingHabits: {
        food: { current: 0, recommended: 0 },
        transport: { current: 0, recommended: 0 },
        shopping: { current: 0, recommended: 0 },
        entertainment: { current: 0, recommended: 0 },
    },
    healthScore: 0,
};

const calculateDerivedData = (income, expenses, currentSavings, goals) => {
    const savings = income - expenses;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

    // Derived values
    const expenseBreakdown = expenses > 0 ? [
        { name: 'Rent & Housing', value: expenses * 0.35, color: '#6366f1' },
        { name: 'Food & Dining', value: expenses * 0.20, color: '#f59e0b' },
        { name: 'Transport', value: expenses * 0.15, color: '#10b981' },
        { name: 'Shopping', value: expenses * 0.10, color: '#ec4899' },
        { name: 'Entertainment', value: expenses * 0.10, color: '#8b5cf6' },
        { name: 'Other', value: expenses * 0.10, color: '#64748b' },
    ] : [];

    const spendingHabits = {
        food: { current: expenses * 0.20, recommended: income * 0.15 },
        transport: { current: expenses * 0.15, recommended: income * 0.10 },
        shopping: { current: expenses * 0.10, recommended: income * 0.05 },
        entertainment: { current: expenses * 0.10, recommended: income * 0.05 },
    };

    const monthlyTrend = income > 0 ? [
        { month: '3 Months Ago', income: income * 0.95, expenses: expenses * 0.98, savings: (income * 0.95) - (expenses * 0.98) },
        { month: '2 Months Ago', income: income * 0.98, expenses: expenses * 0.99, savings: (income * 0.98) - (expenses * 0.99) },
        { month: 'Last Month', income: income, expenses: expenses, savings: income - expenses },
        { month: 'This Month', income: income, expenses: expenses, savings: income - expenses },
    ] : [];

    let healthScore = 0;
    if (income > 0) {
        healthScore = 40; // Base score for having data
        if (savingsRate >= 20) healthScore += 20;
        else if (savingsRate >= 10) healthScore += 10;

        if (currentSavings >= expenses * 3) healthScore += 20;
        else if (currentSavings >= expenses * 1) healthScore += 10;

        if (goals.length > 0) healthScore += 20;
    }

    return {
        monthlyIncome: income,
        monthlyExpenses: expenses,
        monthlySavings: savings > 0 ? savings : 0,
        savingsRate: savingsRate,
        emergencyFund: currentSavings || 0,
        investments: currentSavings > 0 ? currentSavings * 0.6 : 0,
        goals: goals || [],
        expenseBreakdown,
        spendingHabits,
        monthlyTrend,
        healthScore
    };
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [financialData, setFinancialData] = useState(INITIAL_FINANCIAL_DATA);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load
    useEffect(() => {
        const loadUser = async () => {
            try {
                // Check for redirect result first
                const redirectResult = await getRedirectResult(auth).catch(err => {
                    console.error("Redirect error", err);
                    return null;
                });
                
                if (redirectResult) {
                    const firebaseUser = redirectResult.user;
                    const userData = { id: firebaseUser.uid, name: firebaseUser.displayName || 'Google User', email: firebaseUser.email };
                    localStorage.setItem('wb-token', firebaseUser.accessToken);
                    localStorage.setItem('wb-user', JSON.stringify(userData));
                    
                    setUser(userData);
                    setIsAuthenticated(true);
                    setFinancialData(INITIAL_FINANCIAL_DATA);
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error("Error during redirect check:", error);
            }

            const token = localStorage.getItem('wb-token');
            if (token) {
                try {
                    // We'll set authenticated for now, but in a real app we'd validate the token with the backend
                    const userDataStr = localStorage.getItem('wb-user');
                    if (userDataStr) {
                        setUser(JSON.parse(userDataStr));
                        setIsAuthenticated(true);
                        await fetchFinancialData(token);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Error loading user:", error);
                    logout();
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const fetchFinancialData = async (token) => {
        try {
            // First fetch profile
            const profileRes = await fetch(`${API}/api/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (profileRes.ok) {
                const profile = await profileRes.json();

                // Then fetch goals
                const goalsRes = await fetch(`${API}/api/goals`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                let goals = [];
                if (goalsRes.ok) {
                    goals = await goalsRes.json();
                }

                const income = profile.monthlyIncome || 0;
                const expenses = profile.monthlyExpenses || 0;
                const currentSavings = profile.currentSavings || 0;

                setFinancialData(prev => ({
                    ...prev,
                    ...calculateDerivedData(income, expenses, currentSavings, goals)
                }));
            }
        } catch (error) {
            console.error("Failed to fetch financial data", error);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('wb-token', data.token);

                const userData = { id: data.id, name: data.fullName, email: data.email };
                localStorage.setItem('wb-user', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);

                await fetchFinancialData(data.token);
                return { success: true };
            } else {
                return { success: false, error: 'Invalid credentials' };
            }
        } catch (error) {
            console.error("Login Error:", error);

            // Fallback for demo when backend is down
            console.log("Backend offline, using fallback login");
            const userData = { id: 1, name: "Test User", email };
            localStorage.setItem('wb-token', 'demo-token');
            localStorage.setItem('wb-user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            setFinancialData(INITIAL_FINANCIAL_DATA);
            return { success: true };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await fetch(`${API}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: name, email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('wb-token', data.token);

                const userData = { id: data.id, name: data.fullName, email: data.email };
                localStorage.setItem('wb-user', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);

                // Initialize empty profile in backend
                await fetch(`${API}/api/profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.token}` },
                    body: JSON.stringify({
                        monthlyIncome: 0, monthlyExpenses: 0, currentSavings: 0,
                        age: 25, familySize: 1, hasInsurance: false
                    })
                });

                setFinancialData(INITIAL_FINANCIAL_DATA);
                return { success: true };
            } else {
                return { success: false, error: 'Signup failed' };
            }
        } catch (error) {
            console.error("Signup Error:", error);

            // Fallback for demo when backend is down
            console.log("Backend offline, using fallback signup");
            const userData = { id: 1, name, email };
            localStorage.setItem('wb-token', 'demo-token');
            localStorage.setItem('wb-user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            setFinancialData(INITIAL_FINANCIAL_DATA);
            return { success: true };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setFinancialData(INITIAL_FINANCIAL_DATA);
        localStorage.removeItem('wb-token');
        localStorage.removeItem('wb-user');
    };

    const googleLogin = async () => {
        try {
            let result;
            try {
                result = await signInWithPopup(auth, googleProvider);
            } catch (popupError) {
                console.error("Popup failed, trying redirect:", popupError);
                if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user' || popupError.code === 'auth/cross-origin-isolated') {
                    await signInWithRedirect(auth, googleProvider);
                    return { success: false, pendingRedirect: true };
                }
                throw popupError;
            }

            const firebaseUser = result.user;
            
            // For now, we simulate backend logic like the normal login fallback does
            const userData = { id: firebaseUser.uid, name: firebaseUser.displayName || 'Google User', email: firebaseUser.email };
            console.log("Google Login successful. User info:", userData);
            localStorage.setItem('wb-token', firebaseUser.accessToken);
            localStorage.setItem('wb-user', JSON.stringify(userData));
            
            setUser(userData);
            setIsAuthenticated(true);
            setFinancialData(INITIAL_FINANCIAL_DATA);
            
            return { success: true };
        } catch (error) {
            console.error("Google Login Error:", error);
            return { success: false, error: error.message };
        }
    };

    const updateFinancialData = async (newData) => {
        // Optimistic update
        setFinancialData(prev => {
            const income = newData.monthlyIncome !== undefined ? newData.monthlyIncome : prev.monthlyIncome;
            const expenses = newData.monthlyExpenses !== undefined ? newData.monthlyExpenses : prev.monthlyExpenses;
            const savings = newData.emergencyFund !== undefined ? newData.emergencyFund : prev.emergencyFund;
            return {
                ...prev,
                ...calculateDerivedData(income, expenses, savings, prev.goals)
            };
        });

        // Sync with backend
        const token = localStorage.getItem('wb-token');
        if (token && token !== 'demo-token') {
            try {
                // Fetch existing first to preserve other fields
                const profileRes = await fetch(`${API}/api/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (profileRes.ok) {
                    const profile = await profileRes.json();

                    await fetch(`${API}/api/profile`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            ...profile,
                            monthlyIncome: newData.monthlyIncome !== undefined ? newData.monthlyIncome : profile.monthlyIncome,
                            monthlyExpenses: newData.monthlyExpenses !== undefined ? newData.monthlyExpenses : profile.monthlyExpenses,
                            currentSavings: newData.emergencyFund !== undefined ? newData.emergencyFund : profile.currentSavings
                        })
                    });
                }
            } catch (error) {
                console.error("Failed to sync profile update", error);
            }
        }
    };

    const addGoal = async (goal) => {
        const newGoal = { ...goal, id: Date.now() }; // Temp ID

        // Optimistic update
        setFinancialData(prev => ({
            ...prev,
            goals: [...prev.goals, newGoal],
        }));

        // Sync with backend
        const token = localStorage.getItem('wb-token');
        if (token && token !== 'demo-token') {
            try {
                const response = await fetch(`${API}/api/goals`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(goal)
                });

                if (response.ok) {
                    const savedGoal = await response.json();
                    // Update with real ID
                    setFinancialData(prev => ({
                        ...prev,
                        goals: prev.goals.map(g => g.id === newGoal.id ? savedGoal : g)
                    }));
                }
            } catch (error) {
                console.error("Failed to save goal", error);
            }
        }
    };

    const updateGoal = async (id, updates) => {
        setFinancialData(prev => ({
            ...prev,
            goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g),
        }));

        // Sync with backend
        const token = localStorage.getItem('wb-token');
        if (token && token !== 'demo-token') {
            try {
                const goal = financialData.goals.find(g => g.id === id);
                if (goal) {
                    await fetch(`${API}/api/goals/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ ...goal, ...updates })
                    });
                }
            } catch (error) {
                console.error("Failed to update goal", error);
            }
        }
    };

    const deleteGoal = async (id) => {
        setFinancialData(prev => ({
            ...prev,
            goals: prev.goals.filter(g => g.id !== id),
        }));

        // Sync with backend
        const token = localStorage.getItem('wb-token');
        if (token && token !== 'demo-token') {
            try {
                await fetch(`${API}/api/goals/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Failed to delete goal", error);
            }
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
            <div className="w-8 h-8 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
        </div>; // Can be replaced with a proper loading spinner
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            financialData,
            login,
            signup,
            logout,
            googleLogin,
            updateFinancialData,
            addGoal,
            updateGoal,
            deleteGoal,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

