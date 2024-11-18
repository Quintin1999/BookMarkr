import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include the user property
export interface AuthenticatedRequest extends Request {
    user?: { id: string }; // User object will include only the user ID
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');

    // Debugging log for Authorization header
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Access denied: Invalid token format or missing Authorization header.');
        res.status(401).json({ message: 'Access denied. Invalid token format.' });
        return;
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        console.error('Access denied: Token not provided.');
        res.status(401).json({ message: 'Access denied. Token not provided.' });
        return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not set in the environment variables.');
        res.status(500).json({ message: 'Internal server error. Missing JWT_SECRET.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as { id: string };
        req.user = { id: decoded.id };

        console.log('Decoded Token:', decoded);
        console.log('Authenticated User ID:', req.user.id);

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.error('Token validation error:', error.message);
            res.status(401).json({
                message: 'Token is invalid or expired.',
                error: error.message,
            });
        } else {
            console.error('Unknown error during token validation:', error);
            res.status(500).json({
                message: 'An unknown error occurred during token validation.',
            });
        }
    }
};
