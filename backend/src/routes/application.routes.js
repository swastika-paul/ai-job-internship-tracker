import { Router } from "express";
import {
  createApplication,
  getApplications,
   deleteApplication,
} from "../controllers/application.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const applicationRouter = Router();

applicationRouter.get("/", authenticate, getApplications);
applicationRouter.post("/", authenticate, createApplication);
applicationRouter.delete("/:id", authenticate, deleteApplication);
export default applicationRouter;