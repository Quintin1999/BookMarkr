//backend/routes/bookRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { addBookToLibrary, searchBooks,getBookById } from '../controllers/bookController';

const router = express.Router();

router.get('/search', searchBooks);
router.post('/add', authenticate, addBookToLibrary);
router.get('/:id', getBookById);

export default router;