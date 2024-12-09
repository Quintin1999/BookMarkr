import { Request, Response, RequestHandler } from 'express';
import Comment from '../models/commentSchema';
import Task from '../models/taskSchema';

interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
    };
  }

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

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
    const { taskId, bookId, content } = req.body;
    const userId = req.user?.id;

    // Log the payload to debug
    console.log("Comment Payload:", { taskId, bookId, userId, content });

    // Check if required fields are missing
    if (!taskId || !bookId || !content || !userId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Create and save the new comment
        const newComment = new Comment({ taskId, bookId, userId, content });
        await newComment.save();

        // Update the task's `comments` array with the new comment's ID
        await Task.findByIdAndUpdate(
            taskId,
            { $push: { comments: newComment._id } },
            { new: true } // Return the updated task
        );

        // Return success response
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);

        if (error instanceof Error) {
            res.status(500).json({ message: "Error adding comment", error: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};


  
  export const getCommentsForBookTasks: RequestHandler = async (req, res) => {
    const { bookId } = req.params;
  
    try {
      const comments = await Comment.find({ bookId })
        .populate('userId', 'username')
        .populate('taskId', 'description');
  
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error fetching comments' });
    }
  };

export const updateComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        comment.content = content || comment.content;
        await comment.save();
        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error updating comment' });
    }
};

export const deleteComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        await comment.deleteOne();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error deleting comment' });
    }
};