import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ExpenseManager from './components/ExpenseManager';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'warm' : 'dark');

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative">
        <header className="px-6 py-4 border-b rounded-b-md sticky top-0 z-20 bg-transparent backdrop-blur-sm flex items-center justify-between">
          <h2 className="text-2xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('expenses')}
              className="btn-primary focus-accent hidden md:inline-flex items-center gap-2"
            >
              New Entry
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="btn-neu flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ color: 'var(--accent)', background: 'transparent' }}>
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
            </button>
          </div>
        </header>

        <section className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'expenses' && <ExpenseManager />}
          {activeTab === 'ai-assistant' && <AIAssistant />}

          {activeTab !== 'dashboard' && activeTab !== 'expenses' && activeTab !== 'ai-assistant' && (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <p className="text-lg font-bold tracking-widest uppercase italic">{activeTab.replace('-', ' ')} module under construction</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;