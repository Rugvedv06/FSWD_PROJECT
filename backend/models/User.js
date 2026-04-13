import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    default: 'User',
  },
  monthlyIncome: {
    type: Number,
    required: [true, 'Please add monthly income'],
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;