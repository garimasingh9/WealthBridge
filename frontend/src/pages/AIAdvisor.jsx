import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, User, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const generateAIResponse = (question, financialData) => {
    const q = question.toLowerCase();
    const { monthlyIncome, monthlyExpenses, monthlySavings, savingsRate, emergencyFund } = financialData;
    const totalSavings = emergencyFund + 220000;

    if (q.includes('afford') && q.includes('bike')) {
        return `Based on your financial profile:\n\n💰 **Monthly Savings:** ₹${monthlySavings.toLocaleString('en-IN')}\n💳 **Current Savings:** ₹${totalSavings.toLocaleString('en-IN')}\n\nA good bike costs around ₹1,50,000. You have enough savings, but buying it outright would significantly reduce your emergency fund.\n\n**My Recommendation:** Save ₹15,000/month specifically for the bike. You'll have enough in ~7 months without touching your emergency fund. Meanwhile, your savings continue to grow!\n\n🎯 **Action Plan:**\n1. Open a separate savings goal for "Bike Fund"\n2. Set up auto-debit of ₹15,000/month\n3. Target purchase date: October 2026`;
    }

    if (q.includes('fd') || q.includes('sip') || q.includes('invest')) {
        return `Great question! Let me compare FD vs SIP for your situation:\n\n📊 **Fixed Deposit (FD)**\n- Returns: ~7% p.a. (guaranteed)\n- Risk: Very low\n- Lock-in: 1-5 years\n- Best for: Short-term goals, emergency fund overflow\n\n📈 **SIP (Systematic Investment Plan)**\n- Returns: ~12-15% p.a. (historical average)\n- Risk: Moderate (market-linked)\n- Lock-in: None (but stay 5+ years)\n- Best for: Long-term wealth building\n\n**My Recommendation for you:**\nWith your savings rate of ${savingsRate}%, I suggest a split approach:\n- **₹10,000/month in SIP** (index fund like Nifty 50) for long-term growth\n- **₹5,000/month in FD/RD** for short-term goals and safety\n\nThis gives you both growth and security! 🚀`;
    }

    if (q.includes('save') && q.includes('month')) {
        return `Based on your income of ₹${monthlyIncome.toLocaleString('en-IN')}/month, here's what I recommend:\n\n📐 **The 50-30-20 Rule (Modified for India):**\n- **50% (₹${Math.round(monthlyIncome * 0.5).toLocaleString('en-IN')})** → Needs (rent, food, utilities, transport)\n- **30% (₹${Math.round(monthlyIncome * 0.3).toLocaleString('en-IN')})** → Savings & Investments\n- **20% (₹${Math.round(monthlyIncome * 0.2).toLocaleString('en-IN')})** → Wants (entertainment, shopping)\n\nYou're currently saving ₹${monthlySavings.toLocaleString('en-IN')} (${savingsRate}%), which is ${savingsRate >= 30 ? 'excellent!' : 'below the recommended 30%.'}\n\n**Quick Wins:**\n1. Reduce food spending by ₹2,000 → save ₹24,000/year\n2. Cut subscriptions you don't use → save ~₹5,000/year\n3. Use cashback apps for routine purchases → save ~₹8,000/year`;
    }

    if (q.includes('emergency') || q.includes('fund')) {
        return `Let me analyze your emergency fund status:\n\n🛡️ **Emergency Fund Analysis:**\n- Monthly Expenses: ₹${monthlyExpenses.toLocaleString('en-IN')}\n- Recommended Fund: ₹${(monthlyExpenses * 6).toLocaleString('en-IN')} (6 months)\n- Current Emergency Fund: ₹${emergencyFund.toLocaleString('en-IN')}\n- Progress: ${Math.round(emergencyFund / (monthlyExpenses * 6) * 100)}%\n\n**You need ₹${(monthlyExpenses * 6 - emergencyFund).toLocaleString('en-IN')} more!**\n\n📋 **Action Plan:**\n1. Set aside ₹${Math.round((monthlyExpenses * 6 - emergencyFund) / 12).toLocaleString('en-IN')}/month for 12 months\n2. Keep this in a liquid fund (better returns than savings)\n3. Don't touch it unless there's a real emergency!\n\nYour financial security depends on this. Make it your #1 priority! 💪`;
    }

    if (q.includes('insurance') || q.includes('insure')) {
        return `Here's my insurance recommendation:\n\n🛡️ **Must-Have Insurance:**\n1. **Term Life Insurance**: ₹50 Lakh cover (~₹500/month)\n2. **Health Insurance**: ₹10 Lakh family floater (~₹1,200/month)\n\n💡 **Why?**\n- Your family depends on your ₹${monthlyIncome.toLocaleString('en-IN')}/month income\n- A medical emergency can cost ₹5-20 Lakh easily\n- Term insurance is cheapest when you're young!\n\n**Quick Tip:** Buy online for 20-30% cheaper premiums. Check PolicyBazaar or InsuranceDekho for comparisons.`;
    }

    // Default response
    return `Thanks for your question! Based on your financial profile:\n\n📊 **Your Snapshot:**\n- Monthly Income: ₹${monthlyIncome.toLocaleString('en-IN')}\n- Monthly Savings: ₹${monthlySavings.toLocaleString('en-IN')} (${savingsRate}%)\n- Total Corpus: ₹${totalSavings.toLocaleString('en-IN')}\n\nI'd be happy to help with more specific questions like:\n- "Can I afford a bike?"\n- "Should I invest in FD or SIP?"\n- "How much should I save monthly?"\n- "How's my emergency fund?"\n- "Do I need insurance?"\n\nAsk me anything about your finances! 😊`;
};

export default function AIAdvisor() {
    const { financialData } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your **WealthBridge AI Advisor** 🤖✨\n\nI can help you with personalized financial guidance based on your actual financial data. Try asking me:\n\n- Can I afford a bike?\n- Should I invest in FD or SIP?\n- How much should I save monthly?\n- How's my emergency fund?\n\nWhat would you like to know?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const response = generateAIResponse(userMessage, financialData);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    const quickActions = [
        'Can I afford a bike?',
        'FD or SIP?',
        'How much to save?',
        'Emergency fund status',
    ];

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="animate-fade-in mb-4">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-primary-500" /> AI Financial Advisor
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Get personalized advice powered by your financial data</p>
            </div>

            {/* Chat area */}
            <div className="flex-1 glass-card p-4 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                                : 'bg-gradient-to-br from-accent-500 to-accent-600'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                ? 'bg-primary-500 text-white rounded-br-md'
                                : 'bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-dark-100 rounded-bl-md'
                            }`}>
                            <div className="text-sm whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{
                                __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                            }} />
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 animate-slide-up">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-dark-100 dark:bg-dark-700 p-4 rounded-2xl rounded-bl-md">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 mb-3">
                {quickActions.map((action, i) => (
                    <button
                        key={i}
                        onClick={() => { setInput(action); }}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                    >
                        {action}
                    </button>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask me anything about your finances..."
                    className="input-field flex-1"
                    id="ai-chat-input"
                />
                <button type="submit" className="btn-primary !px-4" id="ai-send-btn" disabled={!input.trim()}>
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
