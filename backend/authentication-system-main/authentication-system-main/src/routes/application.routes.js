
import { Router } from "express";
import { createApplication } from "../controllers/application.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const applicationRouter = Router();

applicationRouter.post("/", authenticate, createApplication);

export default applicationRouter;
