import React, { useState } from 'react';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-black text-white selection:bg-indigo-500/30 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto bg-grid-slate-900/40 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <header className="px-8 py-6 border-b border-slate-800 backdrop-blur-md bg-black/50 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium transition-all">
              Update Income
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20">
              Add Expense
            </button>
          </div>
        </header>

        <section className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group shadow-2xl">
                <p className="text-slate-500 text-sm mb-2 group-hover:text-indigo-400 font-bold uppercase tracking-widest">Monthly Balance</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-black text-slate-100">$4,250.00</h3>
                   <span className="text-slate-500 text-xs">USD</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded w-fit italic">
                  <span>↗ 12% INCREASE FROM LAST MONTH</span>
                </div>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group shadow-2xl">
                <p className="text-slate-500 text-sm mb-2 group-hover:text-purple-400 font-bold uppercase tracking-widest">Total Expenses</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-black text-slate-100">$2,100.00</h3>
                   <span className="text-slate-500 text-xs">USD</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded w-fit italic">
                  <span>↘ 5% MORE THAN PLANNED</span>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/30 group transition-all">
                <span className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">🤖</span>
                <p className="text-slate-400 font-bold group-hover:text-slate-200 uppercase tracking-widest text-[10px]">Analyze with AI Intelligence</p>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <span className="text-6xl mb-4 grayscale opacity-50">🏗️</span>
              <p className="text-lg font-bold tracking-widest uppercase italic">{activeTab.replace('-', ' ')} module under construction</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;