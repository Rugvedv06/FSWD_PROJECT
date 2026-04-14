import Budget from '../models/Budget.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json({ success: true, count: budgets.length, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { category },
      { category, limit },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ success: false, error: 'Budget not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
