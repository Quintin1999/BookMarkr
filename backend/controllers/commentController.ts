import { Request, Response, RequestHandler } from 'express';
import Comment from '../models/commentSchema';

export const addComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { taskId, userId, content } = req.body;

    try {
        const comment = new Comment({
            taskId,
            userId,
            content,
            likes: 0,
            dislikes: 0,
        });

        await comment.save();
        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error adding comment' });
    }
};

export const likeComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        comment.likes += 1;
        await comment.save();
        res.status(200).json({ message: 'Comment liked', comment });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error liking comment' });
    }
};

export const dislikeComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        comment.dislikes += 1;
        await comment.save();
        res.status(200).json({ message: 'Comment disliked', comment });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error disliking comment' });
    }
};
