import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">L</div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          LifeOS Finance
        </h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            👤
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Sarah Miller</p>
            <p className="text-xs text-slate-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;