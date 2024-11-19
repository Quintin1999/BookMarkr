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

router.post('/create', authenticate, createClub);

router.post('/join', authenticate, joinClub);

router.delete('/leave', authenticate, leaveClub);

router.get('/my-clubs', authenticate, getUserClubs);

router.get('/:clubId', authenticate, getClubDetails);

router.post('/:clubId/add-book', authenticate, checkClubOwner, addBookToClubLibrary);

router.put('/:clubId/update', authenticate, updateClub);

router.delete('/:clubId/delete', authenticate, deleteClub);

router.get('/:clubId/library', authenticate, getClubLibrary); 

router.delete('/:clubId/library/:bookId/delete', authenticate, deleteBookFromClubLibrary); 


export default router;
