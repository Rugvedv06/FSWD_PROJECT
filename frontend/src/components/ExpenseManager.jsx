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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Add Expense Form */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-indigo-500">➕</span> Log New Transaction
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount ($)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
            <input
              type="date"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Confirm Entry
            </button>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Note (Optional)</label>
            <input
              type="text"
              placeholder="What was this for?"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>
        </form>
      </div>

      {/* Expense List */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">Recent History</h3>
          <span className="text-slate-500 text-sm font-mono">{expenses.length} Records found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Transaction</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {expenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-medium text-slate-100">{expense.note || 'No description'}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">{new Date(expense.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-bold uppercase text-slate-300 tracking-tighter">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-mono font-bold text-indigo-400">
                    -${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(expense._id)}
                      className="text-slate-600 hover:text-red-500 transition-colors text-lg opacity-0 group-hover:opacity-100"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-500 italic">
                    No transactions captured in the registry yet.
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