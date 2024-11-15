
// backend/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include the user property
export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Type of `user` is now defined
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Default_secret') as { userId: string };
    req.user = { id: decoded.userId };  // Attach user info to `req.user`
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token is invalid or expired',
      error: error instanceof Error ? error.message : 'Token validation failed',
    });
  }
};
