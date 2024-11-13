import express, { Request, Response } from 'express';  // Import Request and Response types
const router = express.Router();

// Define routes
router.post('/', (req: Request, res: Response) => {
    const { content } = req.body; // Use req.body if needed for POST requests
    res.send(`Comment added with content: ${content}`);
});

router.patch('/:commentId/like', (req: Request<{ commentId: string }>, res: Response) => {
    const { commentId } = req.params;
    res.send(`Like comment with ID: ${commentId}`);
});

export default router;