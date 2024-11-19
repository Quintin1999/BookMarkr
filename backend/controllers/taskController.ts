// backend/controllers/taskController.ts

import { Request, Response, RequestHandler } from 'express';
import Task from '../models/taskSchema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Create a new task
export const addTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { bookId, description, status = 'pending' } = req.body;
    const userId = req.user?.id; 

    try {
        const task = new Task({
            bookId,
            createdBy: userId,
            description,
            status,
            comments: [],
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error creating task' });
    }
};

// Get all tasks for a specific book
export const getTasksForBook: RequestHandler = async (req, res) => {
    const { bookId } = req.params;

    try {
        const tasks = await Task.find({ bookId }).populate('comments');
        if (!tasks || tasks.length === 0) {
            res.status(404).json({ message: `No tasks found for book ID: ${bookId}` });
            return; // Ensure no further code runs after sending a response
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks.', error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};
// Get all tasks for the authenticated user
export const getUserTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        const tasks = await Task.find({ createdBy: userId }).populate('bookId', 'title');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error fetching user tasks' });
    }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;
    const { description, status } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: { description, status } },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error updating task' });
    }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error deleting task' });
    }
};