import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ExpenseManager from './components/ExpenseManager';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Budget from './components/Budget';
import AuthPage from './components/AuthPage';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import { useAuth } from './context/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { toasts, addToast, removeToast } = useToast();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'warm' : 'dark');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Financial Overview';
      case 'expenses': return 'Transactions';
      case 'budget': return 'Budget Planning';
      case 'ai-assistant': return 'AI Co-Pilot';
      case 'settings': return 'System Settings';
      default: return 'LifeOS Finance';
    }
  };

  const getBreadcrumb = () => {
    const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (activeTab === 'dashboard') return `Overview · ${date}`;
    return `App · ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  };

  return (
    <div className="flex h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        logout={logout}
        user={user}
      />

      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-20 px-4 md:px-8 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-[var(--surface-2)] rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div>
              <h2 className="text-xl font-bold tracking-tight">{getPageTitle()}</h2>
              <p className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">{getBreadcrumb()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--muted)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[var(--accent)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--muted)]" />
              )}
            </button>
          </div>
        </header>

        <section className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'expenses' && <ExpenseManager addToast={addToast} />}
          {activeTab === 'budget' && <Budget addToast={addToast} />}
          {activeTab === 'ai-assistant' && <AIAssistant />}
          {activeTab === 'settings' && <Settings theme={theme} setTheme={setTheme} />}
        </section>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;