import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const ConnectionDb = async () => {
  if (!MONGO_URL) {
    console.error("❌ MONGO_URL not found in environment variables.");
    throw new Error("MONGO_URL is missing");
  }

  // Prevent duplicate DB connections in dev
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(MONGO_URL); // ✅ no deprecated options
    console.log("✅ MongoDB successfully connected.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

export default ConnectionDb;
