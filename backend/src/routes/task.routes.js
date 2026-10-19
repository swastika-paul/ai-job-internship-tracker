
import { Router } from "express";
import {
  getTasks,
  createTask,
  toggleTask,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const taskRouter = Router();

taskRouter.get("/", authenticate, getTasks);
taskRouter.post("/", authenticate, createTask);
taskRouter.patch("/:id/toggle", authenticate, toggleTask);

export default taskRouter;
