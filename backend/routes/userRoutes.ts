// backend/routes/userRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createUser, loginUser,updateUser,deleteUser,getUserLibrary } from '../controllers/userController';

const router = express.Router();

// User creation route
router.post('/create', createUser);

// User login route
router.post('/login', loginUser);

//User update route
router.put('/update', authenticate, updateUser);

//User delete route
router.delete('/delete', authenticate, deleteUser);

//User library route
router.get('/library', authenticate, getUserLibrary);
export default router;
