import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    // For now, we just get the first user since there's no auth
    let user = await User.findOne();
    if (!user) {
      user = await User.create({ name: 'User', monthlyIncome: 5000 });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { monthlyIncome } = req.body;
    let user = await User.findOneAndUpdate(
      {},
      { monthlyIncome },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
