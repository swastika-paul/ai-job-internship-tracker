
import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/config.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

