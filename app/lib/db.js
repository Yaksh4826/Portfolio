import mongoose from 'mongoose';

export const connectDB = async () => {
  // Access via process.env
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(uri);
};