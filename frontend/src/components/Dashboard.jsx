import React, { useState, useEffect } from 'react';
import { TrendingUp, IndianRupee, Brain, Shield, ArrowUpRight, ArrowDownRight, Wallet, Target, Activity, Settings as SettingsIcon } from 'lucide-react';
import { getAIAnalysis, getExpenses } from '../services/api';
import SpendChart from './SpendChart';
import { getCategoryColor } from '../utils/categoryColors';
import formatCurrency from '../utils/formatCurrency';
import { useAuth } from '../context/AuthContext';
import Skeleton from './Skeleton';

const Dashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';
  const monthlyIncome = user?.monthlyIncome || 0;

  const [analysis, setAnalysis] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analysisRes, expensesRes] = await Promise.all([
          getAIAnalysis(),
          getExpenses()
        ]);
        setAnalysis(analysisRes.data.data);
        setExpenses(expensesRes.data.data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const calculateComparison = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthTotal = expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const lastMonthTotal = expenses
      .filter(e => {
        const d = new Date(e.date);
        const lm = currentMonth === 0 ? 11 : currentMonth - 1;
        const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === lm && d.getFullYear() === ly;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const delta = lastMonthTotal === 0 ? 0 : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1);
    
    // Savings calculation
    const savings = monthlyIncome - thisMonthTotal;
    const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome * 100).toFixed(1) : 0;
    
    // Health Score
    let health = 50; 
    if (monthlyIncome > 0) {
      if (thisMonthTotal < monthlyIncome * 0.5) health = 95;
      else if (thisMonthTotal < monthlyIncome * 0.8) health = 75;
      else if (thisMonthTotal < monthlyIncome) health = 60;
      else health = 30;
    }

    return { thisMonthTotal, lastMonthTotal, delta, savings, savingsRate, health };
  };

  const { thisMonthTotal, lastMonthTotal, delta, savings, savingsRate, health } = calculateComparison();

  if (loading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Skeleton className="h-32" count={5} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );

  const kpiCards = [
    {
      title: 'Monthly Income',
      value: formatCurrency(monthlyIncome, currency),
      context: 'Primary Revenue',
      icon: Wallet,
      color: 'var(--accent)'
    },
    {
      title: 'Total Outflow',
      value: formatCurrency(thisMonthTotal, currency),
      context: `${Math.abs(delta)}% vs last month`,
      icon: IndianRupee,
      trend: parseFloat(delta) > 0 ? 'up' : 'down',
      color: 'var(--accent)'
    },
    {
      title: 'Current Savings',
      value: formatCurrency(savings, currency),
      context: `${savingsRate}% savings rate`,
      icon: Target,
      color: 'var(--success)'
    },
    {
      title: 'Monthly Forecast',
      value: formatCurrency(analysis?.prediction || 0, currency),
      context: 'AI Prediction',
      icon: TrendingUp,
      color: 'var(--accent)'
    },
    {
      title: 'Health Score',
      value: `${health}/100`,
      context: health > 70 ? 'Optimal Status' : health > 40 ? 'Stable Status' : 'Critical Status',
      icon: Activity,
      color: health > 70 ? 'var(--success)' : health > 40 ? 'var(--warning)' : 'var(--danger)'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {monthlyIncome === 0 && (
        <div className="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-[var(--bg)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text)]">Financial profile incomplete</p>
              <p className="text-xs text-[var(--muted)]">Set your monthly income in settings to unlock deep AI analysis.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('settings')}
            className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:underline"
          >
            Configure Now
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((card, i) => (
          <div key={i} className="card relative transition-transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: card.color }} />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{card.title}</span>
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{card.value}</h3>
              {card.trend && (
                <span className={`text-[10px] font-bold flex items-center ${card.trend === 'up' ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </span>
              )}
            </div>
            <p className="text-[10px] font-medium" style={{ color: 'var(--muted)' }}>{card.context}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualization & Income Bar */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-bold text-[var(--text)] text-sm uppercase tracking-wider">Outflow Velocity</h4>
                <p className="text-xs font-medium text-[var(--muted)]">Spend distribution by category</p>
              </div>
            </div>
            <div className="h-[320px]">
               <SpendChart expenses={expenses} />
            </div>
          </div>

          <div className="card">
             <h4 className="font-bold text-[var(--text)] text-[10px] uppercase tracking-[0.2em] mb-4">Liquidity Distribution</h4>
             <div className="h-4 w-full bg-[var(--surface-2)] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (thisMonthTotal / (monthlyIncome || 1)) * 100)}%` }}
                />
             </div>
             <div className="flex justify-between mt-3">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                   <p className="text-[10px] font-bold text-[var(--muted)] uppercase">Burned: {formatCurrency(thisMonthTotal, currency)}</p>
                </div>
                <p className="text-[10px] font-bold text-[var(--muted)] uppercase">Remaining: {formatCurrency(savings > 0 ? savings : 0, currency)}</p>
             </div>
          </div>
        </div>

        {/* Recent Transactions & Insights */}
        <div className="space-y-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-[var(--text)] text-sm uppercase tracking-wider">Recent Activity</h4>
              <button 
                onClick={() => setActiveTab('expenses')}
                className="text-[10px] font-bold uppercase tracking-wider hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                Full Ledger
              </button>
            </div>
            <div className="space-y-4">
              {expenses.slice(0, 6).map((exp, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: getCategoryColor(exp.category) }} />
                    <div>
                      <p className="text-xs font-bold truncate max-w-[120px]" style={{ color: 'var(--text)' }}>{exp.note || exp.category}</p>
                      <p className="text-[10px] font-medium" style={{ color: 'var(--muted)' }}>{new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{formatCurrency(exp.amount, currency)}</span>
                </div>
              ))}
              {expenses.length === 0 && (
                <p className="text-center py-4 text-xs italic" style={{ color: 'var(--muted)' }}>No data found.</p>
              )}
            </div>
          </div>

          <div className="card border-l-2 border-[var(--accent)]" style={{ background: 'var(--surface-2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h4 className="font-bold text-[10px] uppercase tracking-wider" style={{ color: 'var(--text)' }}>AI Financial Intel</h4>
            </div>
            <p className="text-xs leading-relaxed mb-6 font-medium" style={{ color: 'var(--text)' }}>
              {analysis?.personality ? `Your spending pattern is classified as: ${analysis.personality}.` : 'Scanning your spending habits to provide actionable intelligence...'}
            </p>
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
               <p className="text-[10px] uppercase font-bold tracking-[0.15em] mb-2" style={{ color: 'var(--muted)' }}>Optimization Path</p>
               <p className="text-[11px] font-bold leading-relaxed" style={{ color: 'var(--text)' }}>{analysis?.advice || 'Collect more transaction data to enable predictive forecasting.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;