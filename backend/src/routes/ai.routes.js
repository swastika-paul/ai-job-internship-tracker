import express from "express";
import { analyzeJobDescription } from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const aiRouter = express.Router();

aiRouter.post("/analyze", authenticate, analyzeJobDescription);

export default aiRouter;