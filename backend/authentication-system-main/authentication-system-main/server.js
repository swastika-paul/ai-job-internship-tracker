import app from "./src/app.js";
import connectDB from "./src/config/database.js";

console.log("1. server.js started");

const PORT = 3000;

async function startServer() {
  console.log("2. starting startServer()");

  try {
    console.log("3. trying MongoDB connection...");

    await connectDB();

    console.log("4. MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`5. Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("6. Failed to start server:");
    console.error(error);
    process.exit(1);
  }
}

startServer();