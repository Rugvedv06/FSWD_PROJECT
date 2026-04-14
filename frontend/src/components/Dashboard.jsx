import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Brain, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getAIAnalysis, getExpenses } from '../services/api';
import SpendChart from './SpendChart';
import { getCategoryColor } from '../utils/categoryColors';

const Dashboard = ({ setActiveTab }) => {
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
    return { thisMonthTotal, lastMonthTotal, delta };
  };

  const { thisMonthTotal, delta } = calculateComparison();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
    </div>
  );

  const kpiCards = [
    {
      title: 'Current Spending',
      value: `$${thisMonthTotal.toFixed(2)}`,
      context: 'Monthly Outflow',
      icon: DollarSign,
      color: 'var(--accent)'
    },
    {
      title: 'AI Classification',
      value: analysis?.personality || 'Neutral',
      context: 'Behavior Pattern',
      icon: Brain,
      color: 'var(--accent)'
    },
    {
      title: 'Monthly Forecast',
      value: `$${analysis?.prediction || '0.00'}`,
      context: 'Velocity Prediction',
      icon: TrendingUp,
      color: 'var(--accent)'
    },
    {
      title: 'vs Last Month',
      value: `${Math.abs(delta)}%`,
      context: parseFloat(delta) > 0 ? 'Spending Increased' : 'Spending Decreased',
      icon: Shield,
      trend: parseFloat(delta) > 0 ? 'up' : 'down',
      color: 'var(--accent)'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <div key={i} className="card relative transition-transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: card.color }} />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{card.title}</span>
              <card.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{card.value}</h3>
              {card.trend && (
                <span className={`text-xs font-bold flex items-center ${card.trend === 'up' ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium" style={{ color: 'var(--muted)' }}>{card.context}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualization */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold" style={{ color: 'var(--text)' }}>Allocation Analysis</h4>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Resource distribution by category</p>
            </div>
          </div>
          <div className="h-[350px]">
             <SpendChart expenses={expenses} />
          </div>
        </div>

        {/* Recent Transactions & Insights */}
        <div className="space-y-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold" style={{ color: 'var(--text)' }}>Recent Activity</h4>
              <button 
                onClick={() => setActiveTab('expenses')}
                className="text-[10px] font-bold uppercase tracking-wider hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {expenses.slice(0, 5).map((exp, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: getCategoryColor(exp.category) }} />
                    <div>
                      <p className="text-xs font-bold truncate max-w-[120px]" style={{ color: 'var(--text)' }}>{exp.note || exp.category}</p>
                      <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>${exp.amount.toFixed(2)}</span>
                </div>
              ))}
              {expenses.length === 0 && (
                <p className="text-center py-4 text-xs italic" style={{ color: 'var(--muted)' }}>No recent activity.</p>
              )}
            </div>
          </div>

          <div className="card" style={{ background: 'var(--surface-2)', borderColor: 'var(--accent-ring)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>AI Financial Intel</h4>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text)', fontWeight: 500 }}>
              {analysis?.summary || 'Scanning your spending habits to provide actionable intelligence...'}
            </p>
            <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
               <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Actionable Advice</p>
               <p className="text-[11px] font-medium" style={{ color: 'var(--text)' }}>{analysis?.advice || 'Collect more data for prediction.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;