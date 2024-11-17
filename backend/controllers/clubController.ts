// backend/controllers/clubController.ts

import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Club from '../models/clubSchema';
import User from '../models/userSchema';
import Book from '../models/bookSchema';
import mongoose from 'mongoose';

// Create a new club
export const createClub = async (req: Request, res: Response): Promise<void> => {
    const { name, description, roomKey } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id; // Ensure authenticated user ID is available

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        // Check if the club with the same name already exists
        const existingClub = await Club.findOne({ name });
        if (existingClub) {
            res.status(400).json({ message: 'A club with this name already exists' });
            return;
        }

        // Create a new club with owner as an ObjectId
        const newClub = new Club({
            name,
            description,
            roomKey,
            owner: new mongoose.Types.ObjectId(userId), // Ensure owner is stored as ObjectId
        });

        // Save the club in the database
        await newClub.save();

        // Add the club to the user's joinedClubs array
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { joinedClubs: newClub._id } }, // Add the club to joinedClubs only if not already there
            { new: true } // Return the updated document
        );

        res.status(201).json({ message: 'Club created successfully', club: newClub });
    } catch (error: unknown) {
        console.error('Error creating club:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error creating club' });
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
        
        // Check if the roomKey matches
        if (club.roomKey !== roomKey) {
            res.status(403).json({ message: 'Invalid room key' });
            return;
        }

        // Prevent the owner from being added to members
        if (club.owner.toString() === userId) {
            res.status(400).json({ message: 'Owner cannot join as a member' });
            return;
        }

        await User.findByIdAndUpdate(userId, { $addToSet: { joinedClubs: clubId } });
        await Club.findByIdAndUpdate(clubId, { $addToSet: { members: userId } });

        res.status(200).json({ message: 'User joined the club successfully' });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error joining club' });
    }
};

// Leave a club
export const leaveClub = async (req: Request, res: Response): Promise<void> => {
    const { userId, clubId } = req.body;

    try {
        const club = await Club.findById(clubId);

        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }

        // Prevent the owner from leaving their own club
        if (club.owner.toString() === userId) {
            res.status(400).json({ message: 'Owner cannot leave their own club' });
            return;
        }

        await User.findByIdAndUpdate(userId, { $pull: { joinedClubs: clubId } });
        await Club.findByIdAndUpdate(clubId, { $pull: { members: userId } });

        res.status(200).json({ message: 'User left the club successfully' });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error leaving club' });
    }
};

export const getClubDetails = async (req: Request, res: Response): Promise<void> => {
    const { clubId } = req.params;

    try {
        const club = await Club.findById(clubId)
            .populate('owner', 'name') // Populating owner name
            .populate('members', 'name'); // Populating members' names

        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }

        res.status(200).json(club);
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error fetching club details' });
    }
};

export const addBookToClubLibrary = async (req: Request, res: Response): Promise<void> => {
    const { clubId } = req.params;
    const { bookId } = req.body;

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }

        // Check if the book exists in the Book collection
        const book = await Book.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }

        // Check if the book already exists in the club's library
        if (club.books.includes(bookId)) {
            res.status(400).json({ message: 'Book already exists in the club library' });
            return;
        }

        // Add the book to the club's books array
        club.books.push(bookId);
        await club.save();

        res.status(200).json({ message: 'Book added to club library successfully' });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error adding book to club library' });
    }
};

export const getUserClubs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        console.error('User ID not found in request');
        res.status(401).json({ message: 'User is not authenticated' });
        return;
    }

    try {
        console.log('Fetching clubs for User ID:', userId);
        const clubs = await Club.find({ owner: userId }); // Adjust this query as needed
        console.log('Clubs found:', clubs); // Log the fetched clubs
        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error fetching user clubs:', error); // Log the error
        res.status(500).json({ message: 'Error fetching user clubs', error });
    }
};