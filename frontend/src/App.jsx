import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ExpenseManager from './components/ExpenseManager';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';

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
            <button 
               onClick={() => setActiveTab('expenses')}
               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
            >
              New Data Entry
            </button>
          </div>
        </header>

        <section className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'expenses' && <ExpenseManager />}
          {activeTab === 'ai-assistant' && <AIAssistant />}

          {activeTab !== 'dashboard' && activeTab !== 'expenses' && activeTab !== 'ai-assistant' && (
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