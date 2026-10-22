import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('MongoDB connection failure:', err);
    process.exit(1);
  }
};

export default connectDB;