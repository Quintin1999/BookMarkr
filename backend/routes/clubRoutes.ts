// backend/routes/clubRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createClub, joinClub, leaveClub, getClubDetails, addBookToClubLibrary, getUserClubs } from '../controllers/clubController';
import { checkClubOwner } from '../middleware/checkRole';

const router = express.Router();

// Routes for club management
router.post('/create', authenticate, createClub);
router.post('/join', authenticate, joinClub);
router.delete('/leave', authenticate, leaveClub);
router.get('/:clubId', authenticate, getClubDetails);
router.get('/my-clubs', authenticate, getUserClubs);
router.post('/:clubId/add-book', authenticate, addBookToClubLibrary);

// Add a book to the club library (only accessible by the club owner)
router.post('/club/:clubId/add-book', authenticate, checkClubOwner, addBookToClubLibrary);

export default router;
