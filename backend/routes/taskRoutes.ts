import express, { Request, Response } from 'express';  // Import types
const router = express.Router();

// Define routes with explicit typing for req and res
router.post('/', (_req: Request, res: Response) => {  // Use _req to signal it's unused
    res.send('Task route');
});

router.get('/:bookId', (req: Request<{ bookId: string }>, res: Response) => {
    const { bookId } = req.params;  // Access the bookId from the route parameters
    res.send(`Get tasks for book with ID: ${bookId}`);
});

export default router;