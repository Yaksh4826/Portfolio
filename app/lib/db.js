import mongoose from "mongoose";


const MONGO_URI =  process.env.MONGO_URI;

export const connectDB = async () => {
  return mongoose.connect(MONGODB_URI);
};