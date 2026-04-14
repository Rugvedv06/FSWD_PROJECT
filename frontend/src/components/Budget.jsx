import React, { useState, useEffect } from 'react';
import { getBudgets, setBudget, getExpenses } from '../services/api';
import { getCategoryColor } from '../utils/categoryColors';

const Budget = ({ addToast }) => {
  const [budgets, setBudgets] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Travel', 'Other'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [budgetsRes, expensesRes] = await Promise.all([
          getBudgets(),
          getExpenses()
        ]);
        
        const budgetMap = {};
        budgetsRes.data.data.forEach(b => {
          budgetMap[b.category] = b.limit;
        });
        setBudgets(budgetMap);
        setExpenses(expensesRes.data.data);
      } catch (error) {
        console.error('Error loading budget data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateBudget = async (category, limit) => {
    if (Number(limit) < 0) {
      addToast(`Budget limit cannot be negative.`, 'error');
      return;
    }
    try {
      await setBudget({ category, limit: Number(limit) });
      addToast(`${category} budget updated.`, 'success');
    } catch (error) {
      addToast(`Failed to update ${category} budget.`, 'error');
    }
  };

  const getMonthlySpend = (category) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return e.category === category && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const spend = getMonthlySpend(category);
          const limit = budgets[category] || 0;
          const percent = limit > 0 ? (spend / limit) * 100 : 0;
          
          let statusColor = 'var(--success)';
          if (percent >= 100) statusColor = 'var(--danger)';
          else if (percent >= 75) statusColor = 'var(--warning)';

          return (
            <div key={category} className="card relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full h-1" 
                style={{ background: getCategoryColor(category) }}
              />
              
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[var(--text)]">{category}</h4>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--muted)' }}>Spent</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>₹{spend.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'var(--muted)' }}>₹</span>
                    <input
                      type="number"
                      min="0"
                      value={budgets[category] || ''}
                      onChange={(e) => setBudgets({...budgets, [category]: e.target.value})}
                      placeholder="Set limit"
                      className="w-full pl-5 pr-2 py-1.5 text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => handleUpdateBudget(category, budgets[category])}
                    className="btn-primary text-xs py-1.5"
                  >
                    Set
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span style={{ color: 'var(--muted)' }}>{percent.toFixed(0)}% Utilized</span>
                    <span style={{ color: statusColor }}>{limit > 0 ? `₹${(limit - spend).toFixed(2)} left` : 'No limit'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ width: `${Math.min(percent, 100)}%`, background: statusColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
