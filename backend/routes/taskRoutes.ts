// backend/routes/taskRoutes.ts

import express from 'express';
import {
    addTask,
    getTasksForBook,
    getUserTasks,
    updateTask,
    deleteTask,
} from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create', authenticate, addTask);          // Create a new task
router.get('/book/:bookId', authenticate, getTasksForBook); // Get tasks for a specific book
router.get('/user', authenticate, getUserTasks);        // Get tasks for the authenticated user
router.put('/:taskId', authenticate, updateTask);       // Update a specific task
router.delete('/:taskId', authenticate, deleteTask);    // Delete a specific task

export default router;