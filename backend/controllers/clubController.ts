// backend/controllers/clubController.ts

import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Club from '../models/clubSchema';
import User from '../models/userSchema';
import Book from '../models/bookSchema';

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
            owner: userId,
        });

        // Save the club in the database
        await newClub.save();

        // Update user's createdClubs array
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { createdClubs: newClub._id } }, // Add the club to createdClubs array
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
        if (club.library.includes(bookId)) {
            res.status(400).json({ message: 'Book already exists in the club library' });
            return;
        }

        // Add the book to the club's books array
        club.library.push(bookId);
        await club.save();

        res.status(200).json({ message: 'Book added to club library successfully' });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error adding book to club library' });
    }
};

interface PopulatedClub {
    _id: string; // Or mongoose.Types.ObjectId
    name: string;
    description: string;
}

export const getUserClubs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        console.error('No authenticated user ID found');
        res.status(401).json({ message: 'User is not authenticated' });
        return;
    }

    try {
        console.log('Fetching user clubs for User ID:', userId);

        const user = await User.findById(userId)
            .populate<{ createdClubs: PopulatedClub[] }>('createdClubs', 'name description')
            .populate<{ joinedClubs: PopulatedClub[] }>('joinedClubs', 'name description');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const clubs = [
            ...(user.createdClubs as PopulatedClub[]).map((club) => ({
                _id: club._id.toString(),
                name: club.name,
                description: club.description,
                role: 'Owner',
            })),
            ...(user.joinedClubs as PopulatedClub[]).map((club) => ({
                _id: club._id.toString(),
                name: club.name,
                description: club.description,
                role: 'Member',
            })),
        ];

        console.log('Formatted clubs:', clubs);
        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error in getUserClubs:', error);
        res.status(500).json({ message: 'Error fetching user clubs', error });
    }
};
export const updateClub = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { clubId } = req.params;
    const { name, description, roomKey } = req.body;

    try {
        const userId = req.user?.id;

        // Ensure the user owns the club
        const club = await Club.findById(clubId);
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }
        if (club.owner.toString() !== userId) {
            res.status(403).json({ message: 'You do not have permission to update this club' });
            return;
        }

        // Update club details
        const updateData: Partial<{ name: string; description: string; roomKey: string }> = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (roomKey) updateData.roomKey = roomKey;

        const updatedClub = await Club.findByIdAndUpdate(clubId, { $set: updateData }, { new: true });

        res.status(200).json({ message: 'Club updated successfully', club: updatedClub });
    } catch (error) {
        console.error('Error updating club:', error);
        res.status(500).json({ message: 'Error updating club', error });
    }
};
export const deleteClub = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { clubId } = req.params;

    try {
        const userId = req.user?.id;

        // Ensure the user owns the club
        const club = await Club.findById(clubId);
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }
        if (club.owner.toString() !== userId) {
            res.status(403).json({ message: 'You do not have permission to delete this club' });
            return;
        }

        // Delete the club
        await Club.findByIdAndDelete(clubId);

        // Optionally, remove the club from the owner's createdClubs array
        await User.findByIdAndUpdate(userId, { $pull: { createdClubs: clubId } });

        res.status(200).json({ message: 'Club deleted successfully' });
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({ message: 'Error deleting club', error });
    }
};

export const getClubLibrary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { clubId } = req.params;

    try {
        const club = await Club.findById(clubId).populate('library', 'title authors thumbnail description');
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }

        res.status(200).json(club.library); // TypeScript now recognizes `library`
    } catch (error) {
        console.error('Error fetching club library:', error);
        res.status(500).json({ message: 'Error fetching club library', error });
    }
};

export const deleteBookFromClubLibrary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { clubId, bookId } = req.params;

    try {
        const club = await Club.findByIdAndUpdate(
            clubId,
            { $pull: { library: bookId } }, // Update the library field
            { new: true }
        );

        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }

        await Book.findByIdAndDelete(bookId); // Optional: delete the book

        res.status(200).json({ message: 'Book deleted from club library successfully' });
    } catch (error) {
        console.error('Error deleting book from club library:', error);
        res.status(500).json({ message: 'Error deleting book from club library', error });
    }
};


