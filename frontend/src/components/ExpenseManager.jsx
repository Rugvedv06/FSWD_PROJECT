import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Edit2, Trash2, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { getExpenses, addExpense, deleteExpense, updateExpense } from '../services/api';
import { getCategoryColor } from '../utils/categoryColors';
import { exportToCSV } from '../utils/exportCSV';

const ExpenseManager = ({ addToast }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // States for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Travel', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, searchTerm, filterCategory]);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data.data);
    } catch (error) {
      addToast('Failed to fetch expenses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...expenses];
    
    if (searchTerm) {
      result = result.filter(exp => 
        (exp.note && exp.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'All') {
      result = result.filter(exp => exp.category === filterCategory);
    }
    
    setFilteredExpenses(result);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, formData);
        addToast('Expense updated successfully.', 'success');
      } else {
        await addExpense(formData);
        addToast('Expense logged successfully.', 'success');
      }
      
      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      addToast(editingId ? 'Failed to update expense.' : 'Failed to add expense.', 'error');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      note: expense.note || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      addToast('Expense deleted.', 'info');
      fetchExpenses();
    } catch (error) {
      addToast('Failed to delete expense.', 'error');
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredExpenses.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Form Section */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6 text-[var(--accent)] text-lg">
          {editingId ? <Edit2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          <h3 className="font-bold text-[var(--text)]">{editingId ? 'Edit Transaction' : 'Record Transaction'}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--muted)' }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full pl-7 pr-4 py-2"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Category</label>
              <select
                className="w-full px-4 py-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Date</label>
              <input
                type="date"
                className="w-full px-4 py-2"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Detailed Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Weekly groceries at Whole Foods"
              className="w-full px-4 py-2"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1 py-2.5">
              {editingId ? 'Update Record' : 'Log Transaction'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], note: '' });
                }}
                className="btn-outline px-6"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="card overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search notes..." 
                  className="w-full pl-10 h-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <select 
                  className="pl-10 h-10 text-sm"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>
          </div>
          
          <button 
            onClick={() => exportToCSV(filteredExpenses)}
            className="btn-outline h-10 flex items-center gap-2 text-xs uppercase font-bold tracking-widest"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)]">
                <th className="px-4 py-4 text-left font-bold">When</th>
                <th className="px-4 py-4 text-left font-bold">Description</th>
                <th className="px-4 py-4 text-left font-bold">Category</th>
                <th className="px-4 py-4 text-left font-bold">Amount</th>
                <th className="px-4 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {currentRows.map((expense) => (
                <tr key={expense._id} className="group hover:bg-[var(--surface-2)] transition-all">
                  <td className="px-4 py-4 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[var(--text)]">{expense.note || 'Unspecified'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{ background: getCategoryColor(expense.category) }} />
                       <span className="text-xs font-medium text-[var(--text)]">{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-bold tracking-tight text-[var(--text)]">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(expense)}
                        className="p-1.5 hover:text-(--accent) transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleDelete(expense._id)}
                         className="p-1.5 hover:text-(--danger) transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center italic text-sm" style={{ color: 'var(--muted)' }}>
                    No matching transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between bg-[var(--surface-2)] border-t border-[var(--border)]">
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            Showing {indexOfFirstRow + 1}–{Math.min(indexOfLastRow, filteredExpenses.length)} of {filteredExpenses.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-md hover:bg-[var(--border)] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 text-[11px] font-bold rounded-md transition-all ${currentPage === i + 1 ? 'bg-[var(--accent)] text-[var(--bg)]' : 'hover:bg-[var(--border)]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-md hover:bg-[var(--border)] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;