// backend/routes/userRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createUser, loginUser,updateUser,deleteUser,getUserLibrary,deleteBookFromUserLibrary } from '../controllers/userController';

const router = express.Router();

router.post('/create', createUser);

router.post('/login', loginUser);

router.put('/update', authenticate, updateUser);

router.delete('/delete', authenticate, deleteUser);

router.get('/library', authenticate, getUserLibrary);

router.delete('/library/:bookId/delete', authenticate, deleteBookFromUserLibrary);

export default router;
