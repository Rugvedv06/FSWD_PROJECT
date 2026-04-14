import Budget from '../models/Budget.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.status(200).json({ success: true, count: budgets.length, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { category, userId: req.userId },
      { category, limit, userId: req.userId },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!budget) {
      return res.status(404).json({ success: false, error: 'Budget not found or not authorized' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
