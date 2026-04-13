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

// Main API Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'LifeOS Finance API is running' });
});

// Import Routes
import expenseRoutes from './routes/expenseRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
// import userRoutes from './routes/userRoutes.js';

app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);
// app.use('/api/users', userRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();