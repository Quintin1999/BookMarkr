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

router.post('/create', authenticate, addTask); 

router.get('/book/:bookId', authenticate, getTasksForBook); 

router.get('/user', authenticate, getUserTasks); 

router.put('/:taskId', authenticate, updateTask);  
    
router.delete('/:taskId', authenticate, deleteTask);    

export default router;