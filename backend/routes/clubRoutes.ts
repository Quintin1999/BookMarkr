// backend/routes/clubRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { 
    createClub, 
    joinClub, 
    leaveClub, 
    getClubDetails, 
    addBookToClubLibrary, 
    getUserClubs, 
    updateClub, 
    deleteClub,
    getClubLibrary,
    deleteBookFromClubLibrary
} from '../controllers/clubController';
import { checkClubOwner } from '../middleware/checkRole';

const router = express.Router();

// Route to create a new club (requires authentication)
router.post('/create', authenticate, createClub);

// Route to join a club (requires authentication)
router.post('/join', authenticate, joinClub);

// Route to leave a club (requires authentication)
router.delete('/leave', authenticate, leaveClub);

// Route to fetch all clubs created or joined by the authenticated user
router.get('/my-clubs', authenticate, getUserClubs);

// Route to get details of a specific club (requires authentication)
router.get('/:clubId', authenticate, getClubDetails);

// Route to add a book to a club's library (only the club owner can perform this action)
router.post('/:clubId/add-book', authenticate, checkClubOwner, addBookToClubLibrary);

// Update Club
router.put('/:clubId/update', authenticate, updateClub);

// Delete Club
router.delete('/:clubId/delete', authenticate, deleteClub);

//club's library
router.get('/:clubId/library', authenticate, getClubLibrary); 

//delete book from club's library
router.delete('/:clubId/library/:bookId/delete', authenticate, deleteBookFromClubLibrary); 


export default router;
