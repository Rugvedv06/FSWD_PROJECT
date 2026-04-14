import React, { useState, useEffect } from 'react';
import { getProfile, updateIncome } from '../services/api';

const Settings = ({ theme, setTheme }) => {
  const [income, setIncome] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setIncome(res.data.data.monthlyIncome || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveIncome = async () => {
    if (Number(income) < 0) {
       setStatus({ message: 'Income cannot be negative.', type: 'error' });
       return;
    }
    try {
      await updateIncome(Number(income));
      setStatus({ message: 'Income profile updated successfully.', type: 'success' });
    } catch (error) {
      setStatus({ message: 'Failed to update income profile.', type: 'error' });
    }
    setTimeout(() => setStatus({ message: '', type: '' }), 3000);
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="card">
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Financial Profile</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Set your baseline monthly income to train the AI analysis.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
              Monthly Income (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--muted)' }}>$</span>
              <input
                type="number"
                min="0"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full pl-7 pr-4 py-2"
                placeholder="5000"
              />
            </div>
          </div>
          <button onClick={handleSaveIncome} className="btn-primary w-full">
            Save Financial Profile
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Preferences</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Customize your visual experience.</p>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Interface Theme</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Switch between Dark and Warm modes.</p>
          </div>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="bg-[var(--surface)] text-sm border-[var(--border)] rounded px-3 py-1"
          >
            <option value="dark">Dark Mode</option>
            <option value="warm">Warm Mode</option>
          </select>
        </div>
      </div>

      {status.message && (
        <div 
          className={`p-4 rounded-md border text-sm font-medium animate-in fade-in duration-300`}
          style={{ 
            background: status.type === 'success' ? 'var(--accent-ring)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
            color: status.type === 'success' ? 'var(--text)' : 'var(--danger)'
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
};

export default Settings;
