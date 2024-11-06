//backend/routes/bookRoutes.ts

import express from 'express';
import { addBookToLibrary, searchBooks } from '../controllers/bookController';

const router = express.Router();

router.get('/search', searchBooks);
router.get('/add-to-library', addBookToLibrary);

export default router;