// backend/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Default_secret') as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: 'Token is not valid', error: error.message });
    } else {
      res.status(401).json({ message: 'Token is not valid' });
    }
  }
};
