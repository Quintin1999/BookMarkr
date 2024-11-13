// backend/controllers/taskController.ts

import { Request, Response } from 'express';
import Task from '../models/taskSchema';

export const addTask = async (req: Request, res: Response) => {
    const { bookId, userId, description } = req.body;

    try {
        const task = new Task({
            bookId,
            createdBy: userId,
            description,
            comments: [],
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error creating task' });
    }
};

export const getTasksForBook = async (req: Request, res: Response) => {
    const { bookId } = req.params;

    try {
        const tasks = await Task.find({ bookId }).populate('comments');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error fetching tasks' });
    }
};
