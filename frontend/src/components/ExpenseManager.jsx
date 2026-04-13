import React, { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense } from '../services/api';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [loading, setLoading] = useState(true);

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Travel', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense(formData);
      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Expense Form */}
      <div className="neumorph p-6">
        <h3 className="text-lg font-bold mb-4">Log New Transaction</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Amount ($)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              className="w-full rounded-lg px-4 py-2 mt-2 focus-accent"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Category</label>
            <select
              className="w-full rounded-lg px-4 py-2 mt-2 focus-accent"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Date</label>
            <input
              type="date"
              className="w-full rounded-lg px-4 py-2 mt-2 focus-accent"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="btn-primary w-full py-2 rounded-lg focus-accent"
            >
              Confirm
            </button>
          </div>

          <div className="md:col-span-4">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Note (Optional)</label>
            <input
              type="text"
              placeholder="What was this for?"
              className="w-full rounded-lg px-4 py-2 mt-2 focus-accent"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>
        </form>
      </div>

      {/* Expense List */}
      <div className="neumorph overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent History</h3>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>{expenses.length} records</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="group hover:surface-muted transition-colors">
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted)' }}>{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium">{expense.note || 'No description'}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.03)' }}>{expense.category}</span></td>
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--accent)' }}>-${parseFloat(expense.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(expense._id)} className="text-sm" style={{ color: 'var(--muted)' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center" style={{ color: 'var(--muted)' }}>
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;