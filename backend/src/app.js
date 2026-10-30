import cors from "cors";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import applicationRouter from "./routes/application.routes.js";
import taskRouter from "./routes/task.routes.js";
import aiRouter from "./routes/ai.routes.js";
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/ai", aiRouter);

export default app;
