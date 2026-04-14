import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Main API Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'LifeOS Finance API is running' });
});

// Import Middleware
import { protect } from './middleware/protect.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Setup Routes
app.use('/api/auth', authRoutes); // Public

// Protected Routes
app.use('/api/expenses', protect, expenseRoutes);
app.use('/api/ai', protect, aiRoutes);
app.use('/api/budgets', protect, budgetRoutes);
app.use('/api/users', protect, userRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();