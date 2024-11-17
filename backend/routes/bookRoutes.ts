//backend/routes/bookRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { addBookToLibrary, searchBooks } from '../controllers/bookController';

const router = express.Router();

router.get('/search', searchBooks);
router.post('/add', authenticate, addBookToLibrary);

export default router;