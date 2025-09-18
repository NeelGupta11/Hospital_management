import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGODB_URI is not defined in .env.local");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
