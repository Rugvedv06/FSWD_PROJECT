import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { monthlyIncome } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { monthlyIncome },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, currency } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, currency },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
