
import Task from "../models/task.model.js";

export async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    return res.status(500).json({ message: "Failed to fetch tasks." });
  }
}

export async function createTask(req, res) {
  try {
    const { title, due } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const task = await Task.create({
      userId: req.user.id,
      title: title.trim(),
      due: due || "Upcoming",
    });

    return res.status(201).json({ task });
  } catch (error) {
    console.error("Create task error:", error.message);
    return res.status(500).json({ message: "Failed to create task." });
  }
}

export async function toggleTask(req, res) {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.done = !task.done;
    await task.save();

    return res.status(200).json({ task });
  } catch (error) {
    console.error("Toggle task error:", error.message);
    return res.status(500).json({ message: "Failed to update task." });
  }
}
