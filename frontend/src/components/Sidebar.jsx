import React from 'react';
import { LayoutDashboard, Receipt, Wallet, Cpu, Settings, X, Circle, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, logout, user }) => {
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', Icon: Receipt },
    { id: 'budget', label: 'Budget', Icon: Wallet },
    { id: 'ai-assistant', label: 'AI Assistant', Icon: Cpu },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-[240px] bg-[var(--surface)] border-r border-[var(--border)] 
    transform transition-transform duration-300 ease-in-out flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:h-screen
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center">
              <div className="w-4 h-4 bg-[var(--bg)] rounded-sm" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--text)]">LifeOS Finance</span>
          </div>
          <button onClick={onClose} className="md:hidden text-[var(--muted)] hover:text-[var(--text)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-[var(--accent)] text-[var(--bg)]' 
                    : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'}
                `}
              >
                <tab.Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[var(--border)] space-y-4">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-[var(--surface-2)]">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--bg)] font-bold text-sm shrink-0 uppercase">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text)] truncate">{user?.name || 'Account'}</p>
              <div className="flex items-center gap-1.5">
                <Circle className="w-1.5 h-1.5 fill-[var(--success)] text-[var(--success)]" />
                <span className="text-[11px] text-[var(--muted)] font-medium">Connected</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;