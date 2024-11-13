// backend/routes/userRoutes.ts

import express from 'express';
import { createUser, loginUser } from '../controllers/userController';

const router = express.Router();

// User creation route
router.post('/create', createUser);

// User login route
router.post('/login', loginUser);

export default router;
