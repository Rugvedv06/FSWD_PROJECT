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
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl shadow-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Outflow</p>
          <h3 className="text-3xl font-black text-indigo-400">${totals.spent.toFixed(2)}</h3>
          <div className="mt-2 text-[10px] text-slate-500 font-mono italic">DATA FROM {totals.count} TRANSACTIONS</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl shadow-xl border-l-4 border-l-purple-500">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">AI Classification</p>
          <h3 className="text-xl font-black text-slate-100 uppercase tracking-tighter">{analysis?.personality || 'Scanning...'}</h3>
          <div className="mt-2 text-[10px] text-purple-400 font-bold">BEHAVIORAL PATTERN MATCHED</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl shadow-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Velocity Prediction</p>
          <h3 className="text-3xl font-black text-slate-100">${analysis?.prediction || '0.00'}</h3>
          <div className="mt-2 text-[10px] text-slate-500">NEXT 30 DAY FORECAST</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl shadow-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Financial Risk</p>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
            analysis?.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500' : 
            analysis?.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' : 
            'bg-green-500/20 text-green-500'
          }`}>
            {analysis?.riskLevel || 'STABLE'}
          </span>
          <div className="mt-3 text-[10px] text-slate-600 leading-tight uppercase font-bold italic">
            "{analysis?.advice || 'Maintain current trajectory.'}"
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualization */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl min-h-[400px]">
          <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Allocation Spectrum</h4>
          <SpendChart expenses={expenses} />
        </div>

        {/* Intelligence Feed */}
        <div className="bg-indigo-900/10 border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
            <span className="text-8xl grayscale group-hover:grayscale-0 transition-all duration-700">🧠</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-indigo-400 font-black tracking-widest text-sm mb-6 uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
              Neural Insights Engine
            </h3>
            <p className="text-slate-300 text-lg font-medium leading-relaxed italic mb-8">
              "System analysis suggests that your <span className="text-slate-100 font-bold decoration-indigo-500 underline decoration-2">velocity of expenditure</span> is currently optimized for long-term growth. No immediate corrective actions are required."
            </p>
            <div className="space-y-4">
               <div className="p-4 bg-black/40 border border-slate-800 rounded-2xl">
                  <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">Alert Hub</p>
                  <p className="text-xs text-slate-400">Behavioral Alert: Detected repeated high-value transactions at 11 PM. Risk: Impulsive Spending.</p>
               </div>
            </div>
            <button className="mt-8 w-full py-4 bg-indigo-600/20 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
              Initiate deep scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;