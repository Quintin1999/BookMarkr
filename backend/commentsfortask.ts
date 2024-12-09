import Task from "./models/taskSchema";
import Comment from "./models/commentSchema";
import { Request, Response } from "express";

export const getCommentsForTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    // Find the task and populate the comments
    const task = await Task.findById(taskId).populate("comments");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return the populated comments
    res.status(200).json(task.comments);
  } catch (error) {
    console.error("Error fetching comments for task:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
};
