import express from 'express';
import {
    addComment,
    getCommentsForBookTasks,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
} from '../controllers/commentController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/',authenticate, addComment as express.RequestHandler);

router.get('/task/:taskId', getCommentsForBookTasks);

router.put('/:commentId', updateComment);

router.delete('/:commentId', deleteComment);

router.patch('/:commentId/like', likeComment);

router.patch('/:commentId/dislike', dislikeComment);

export default router;