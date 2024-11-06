// backend/routes/clubRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createClub, joinClub, leaveClub } from '../controllers/clubController';

const router = express.Router();

router.post('/create', authenticate, createClub);
router.post('/join', authenticate, joinClub);
router.post('/leave', authenticate, leaveClub);

export default router;