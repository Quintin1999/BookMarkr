// backend/routes/clubRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { 
    createClub, 
    joinClub, 
    leaveClub, 
    getClubDetails, 
    addBookToClubLibrary, 
    getUserClubs 
} from '../controllers/clubController';
import { checkClubOwner } from '../middleware/checkRole';

const router = express.Router();

// Route to create a new club (requires authentication)
router.post('/create', authenticate, createClub);

// Route to join a club (requires authentication)
router.post('/join', authenticate, joinClub);

// Route to leave a club (requires authentication)
router.delete('/leave', authenticate, leaveClub);

// Route to get details of a specific club (requires authentication)
router.get('/:clubId', authenticate, getClubDetails);

// Route to fetch all clubs created or joined by the authenticated user
router.get('/my-clubs', authenticate, getUserClubs);

// Route to add a book to a club's library (only the club owner can perform this action)
router.post('/:clubId/add-book', authenticate, checkClubOwner, addBookToClubLibrary);

export default router;
