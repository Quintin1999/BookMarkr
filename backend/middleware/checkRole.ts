// backend/middleware/checkRole.ts

import { Response, NextFunction } from 'express';
import Club from '../models/clubSchema';
import { AuthenticatedRequest } from './authMiddleware';

export const checkClubOwner = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const clubId: string = req.params.clubId;
    const userId: string | undefined = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'User ID is missing in request. Please log in.' });
        return;
    }

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }

        if (club.owner.toString() !== userId) {
            res.status(403).json({ message: 'Access denied. Only the club owner can perform this action.' });
            return;
        }

        next();
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: 'Server error while checking club ownership' });
    }
};
