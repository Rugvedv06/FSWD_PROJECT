import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const healthCheck = () => api.get('/health');

// User Services
export const getProfile = () => api.get('/users/profile');
export const updateIncome = (income) => api.patch('/users/income', { monthlyIncome: income });

// Expense Services
export const getExpenses = () => api.get('/expenses');
export const addExpense = (expenseData) => api.post('/expenses', expenseData);
export const updateExpense = (id, expenseData) => api.patch(`/expenses/${id}`, expenseData);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Budget Services
export const getBudgets = () => api.get('/budgets');
export const setBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// AI Services
export const askAI = (query) => api.post('/ai/chat', { query });
export const getAIAnalysis = () => api.get('/ai/analysis');
export const getAIPrediction = () => api.get('/ai/predict');

export default api;