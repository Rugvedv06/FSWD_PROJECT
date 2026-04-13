import React from 'react';
import { Layers, BarChart2, PieChart, Wallet, Cpu, User } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', Icon: BarChart2 },
    { id: 'expenses', label: 'Expenses', Icon: PieChart },
    { id: 'budget', label: 'Budget', Icon: Wallet },
    { id: 'ai-assistant', label: 'AI Assistant', Icon: Cpu },
  ];

  return (
    <div className="w-64 h-screen p-6 flex flex-col neumorph">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold accent-bg">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          LifeOS Finance
        </h1>
      </div>

      <nav className="flex-1 space-y-3">
        {tabs.map((tab) => {
          const ActiveIconColor = activeTab === tab.id ? 'var(--bg)' : 'var(--muted)';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium`}
              style={{ background: activeTab === tab.id ? 'var(--accent)' : 'transparent', color: activeTab === tab.id ? 'var(--bg)' : 'var(--muted)' }}
            >
              <tab.Icon className="w-5 h-5" style={{ color: ActiveIconColor }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full neumorph-inset flex items-center justify-center">
            <User className="w-5 h-5" style={{ color: 'var(--muted)' }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Account</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;