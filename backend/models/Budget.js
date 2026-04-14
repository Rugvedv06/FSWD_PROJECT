import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Travel', 'Other'],
  },
  limit: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Ensure unique budget per category per user
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
