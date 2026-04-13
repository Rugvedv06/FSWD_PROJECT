import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeos-finance';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB not available. Running in offline mode.');
    console.warn('To enable DB, ensure MongoDB is running or set MONGODB_URI in .env');
  }
};

export default connectDB;