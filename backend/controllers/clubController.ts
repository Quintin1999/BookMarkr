// backend/controllers/clubController.ts

import { Request, Response } from 'express';
import Club from '../models/clubSchema';
import User from '../models/userSchema';

// Create a new club
export const createClub = async (req: Request, res: Response): Promise<void> => {
    const { name, description, roomKey, userId } = req.body;

    try {
        const existingClub = await Club.findOne({ name });
        if (existingClub) {
            res.status(400).json({ message: 'Club already exists' });
            return;
        }

        const newClub = new Club({
            name,
            description,
            roomKey,
            members: [userId],
        });

        await newClub.save();

        // Add the club to the user's joinedClubs array
        await User.findByIdAndUpdate(userId, { $addToSet: { joinedClubs: newClub._id } });

        res.status(201).json({ message: 'Club created and joined successfully', club: newClub });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error creating club' });
        }
    }
};

// Join an existing club
export const joinClub = async (req: Request, res: Response): Promise<void> => {
    const { userId, clubId, roomKey } = req.body;

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }
        if (club.roomKey !== roomKey) {
            res.status(403).json({ message: 'Invalid room key' });
            return;
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

// Leave a club
export const leaveClub = async (req: Request, res: Response): Promise<void> => {
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
