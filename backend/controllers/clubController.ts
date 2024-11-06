// backend/controllers/clubController.ts

import Club from '../models/clubSchema';
import User from '../models/userSchema';
import { Request, Response } from 'express';

export const joinClub = async (req: Request, res: Response) => {
    const { userId, clubId, roomKey } = req.body;

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (club.roomKey !== roomKey) {
            return res.status(403).json({ message: 'Invalid room key' });
        }

        await User.findByIdAndUpdate(userId, { $addToSet: { joinedClubs: clubId } });
        await Club.findByIdAndUpdate(clubId, { $addToSet: { members: userId } });

        res.status(200).json({ message: 'User joined the club successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error joining club' });
        }
    }
};

export const leaveClub = async (req: Request, res: Response) => {
    const { userId, clubId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { $pull: { joinedClubs: clubId } });
        await Club.findByIdAndUpdate(clubId, { $pull: { members: userId } });

        res.status(200).json({ message: 'User left the club successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error leaving club' });
        }
    }
};


//When a user tries to join, they need to include the roomKey:
// "userId": "user123",
//"clubId": "club456",
//"roomKey": "validRoomKey123"