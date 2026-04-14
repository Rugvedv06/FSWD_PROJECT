import Expense from '../models/Expense.js';

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    console.error('getExpenses Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add expense
// @route   POST /api/expenses
export const addExpense = async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ success: false, error: 'Please provide amount and category' });
    }

    const expense = await Expense.create({
      amount,
      category,
      date: date || Date.now(),
      note,
      userId: req.userId
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error('addExpense Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.userId });

    if (!expense) {
      return res.status(404).json({ success: false, error: 'No expense found or not authorized' });
    }

    await expense.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update expense
// @route   PATCH /api/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { amount, category, date, note },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, error: 'No expense found or not authorized' });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};