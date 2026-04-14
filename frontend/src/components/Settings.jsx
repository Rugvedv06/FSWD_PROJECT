import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../utils/formatCurrency';
import { User, Mail, Globe, Lock, Save, Loader2 } from 'lucide-react';

const Settings = ({ theme, setTheme, addToast }) => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'INR',
    monthlyIncome: user?.monthlyIncome || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(profileData);
      updateUser(res.data.data);
      addToast('Profile updated successfully.', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return addToast('New passwords do not match.', 'error');
    }
    setPwdLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      addToast('Password changed successfully.', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to change password.', 'error');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Account Settings */}
          <div className="card">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text)' }}>Account Identity</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Primary Currency</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                    <select
                      className="w-full pl-10 pr-4 py-2"
                      value={profileData.currency}
                      onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                    >
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Monthly Income</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--muted)' }}>₹</span>
                    <input
                      type="number"
                      className="w-full pl-7 pr-4 py-2"
                      value={profileData.monthlyIncome}
                      onChange={(e) => setProfileData({ ...profileData, monthlyIncome: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sync Global Profile
              </button>
            </form>
          </div>

          {/* Security */}
          <div className="card">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text)' }}>Security Authentication</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-2"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={pwdLoading}
                className="btn-outline w-full py-2.5 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
              >
                {pwdLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Security Credentials
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          {/* Preferences */}
          <div className="card">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text)' }}>Preferences</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Visual Theme</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`py-2 text-[10px] font-bold uppercase border rounded transition-all ${theme === 'dark' ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]' : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'}`}
                  >
                    Dark Mode
                  </button>
                  <button 
                    onClick={() => setTheme('warm')}
                    className={`py-2 text-[10px] font-bold uppercase border rounded transition-all ${theme === 'warm' ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]' : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'}`}
                  >
                    Warm Mode
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-l-2 border-[var(--accent)]" style={{ background: 'var(--surface-2)' }}>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text)' }}>Data Integrity</h4>
            <p className="text-[10px] font-medium leading-relaxed" style={{ color: 'var(--muted)' }}>
              Your financial data is encrypted and scoped to your unique neural ID. Changing your primary currency will update all displays but will not convert historical values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
