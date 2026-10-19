import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    throw error;
  }
}

export default connectDB;