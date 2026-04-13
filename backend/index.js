import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main API Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'LifeOS Finance API is running' });
});

// Import Routes
// TODO: Placeholder for Route imports
// import userRoutes from './routes/userRoutes.js';
// import expenseRoutes from './routes/expenseRoutes.js';
// import aiRoutes from './routes/aiRoutes.js';

// app.use('/api/users', userRoutes);
// app.use('/api/expenses', expenseRoutes);
// app.use('/api/ai', aiRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();