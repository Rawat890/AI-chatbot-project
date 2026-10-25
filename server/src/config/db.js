import mongoose from 'mongoose';
import env from './env.js';
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

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