import { getFinancialAdvice, checkAffordability, getSpendingAnalysis } from '../services/aiService.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';

// @desc    Get spending analysis and personality
// @route   GET /api/ai/analysis
export const analyzeSpending = async (req, res) => {
  try {
    const user = await User.findOne() || { monthlyIncome: 5000 };
    const expenses = await Expense.find();

    const analysis = await getSpendingAnalysis(expenses, user.monthlyIncome);
    
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Analysis failed' });
  }
};

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
export const chatWithAI = async (req, res) => {
  try {
    const { query } = req.body;
    
    // Fetch user data (mocking single user for MVP)
    const user = await User.findOne() || { monthlyIncome: 5000 };
    const expenses = await Expense.find().sort({ date: -1 }).limit(10);

    const advice = await getFinancialAdvice(expenses, user.monthlyIncome, query);
    
    res.status(200).json({ success: true, data: advice });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI Processing Error' });
  }
};

// @desc    Predict affordability
// @route   POST /api/ai/afford
export const predictAffordability = async (req, res) => {
  try {
    const { amount, category } = req.body;
    
    const user = await User.findOne() || { monthlyIncome: 5000 };
    const expenses = await Expense.find();

    const analysis = await checkAffordability(amount, category, expenses, user.monthlyIncome);
    
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Affordability analysis failed' });
  }
};