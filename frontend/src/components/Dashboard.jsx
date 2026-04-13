import React, { useState, useEffect } from 'react';
import { getAIAnalysis, getExpenses } from '../services/api';
import SpendChart from './SpendChart';

const Dashboard = () => {
  const [analysis, setAnalysis] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({ spent: 0, count: 0 });
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
        const spent = expensesRes.data.data.reduce((sum, e) => sum + e.amount, 0);
        setTotals({ spent, count: expensesRes.data.count });
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 neumorph">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Total Outflow</p>
          <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>${totals.spent.toFixed(2)}</h3>
          <div className="mt-3 text-[12px]" style={{ color: 'var(--muted)' }}>{totals.count} transactions</div>
        </div>

        <div className="p-6 neumorph">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>AI Classification</p>
          <h3 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{analysis?.personality || 'Scanning...'}</h3>
          <div className="mt-2 text-[12px]" style={{ color: 'var(--muted)' }}>Behavior pattern</div>
        </div>

        <div className="p-6 neumorph">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Velocity Prediction</p>
          <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>${analysis?.prediction || '0.00'}</h3>
          <div className="mt-2 text-[12px]" style={{ color: 'var(--muted)' }}>Next 30 days</div>
        </div>

        <div className="p-6 neumorph">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Financial Risk</p>
          <div>
            <span className="px-3 py-1 rounded-full text-[12px] font-bold" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--muted)' }}>{analysis?.riskLevel || 'STABLE'}</span>
          </div>
          <div className="mt-3 text-[12px]" style={{ color: 'var(--muted)' }}>{analysis?.advice || 'Maintain current trajectory.'}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualization */}
        <div className="lg:col-span-2 p-6 neumorph min-h-[420px]">
          <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--muted)' }}>Allocation</h4>
          <SpendChart expenses={expenses} />
        </div>

        {/* Intelligence Feed - simplified */}
        <div className="p-6 neumorph">
          <h3 className="text-sm font-bold uppercase mb-3" style={{ color: 'var(--muted)' }}>AI Insights</h3>
          <p style={{ color: 'var(--text)', fontWeight: 600 }}>{analysis?.summary || 'No recent insights.'}</p>
          <div className="mt-4 text-[13px]" style={{ color: 'var(--muted)' }}>{analysis?.advice || 'No actionable items.'}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;