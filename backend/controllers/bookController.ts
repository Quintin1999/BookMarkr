// backend/controllers/bookController.ts

import axios from 'axios';
import Book from '../models/bookSchema';
import User from '../models/userSchema';
import Club from '../models/clubSchema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

interface GoogleBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        imageLinks?: {
            thumbnail: string;
        };
    };
}

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Query parameter is required and must be a string' });
        return;
    }

    try {
        const response = await axios.get<{ items: GoogleBook[] }>(GOOGLE_BOOKS_API_URL, {
            params: {
                q: query,
                key: process.env.GOOGLE_BOOKS_API_KEY,
            },
        });

        if (!response.data.items || response.data.items.length === 0) {
            res.status(404).json({ message: 'No books found' });
            return;
        }

        const books = response.data.items.map((book) => ({
            googleId: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || ['Unknown'],
            description: book.volumeInfo.description || 'No description available',
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
        }));

        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books from Google Books API:', error);
        res.status(500).json({
            message: 'Error fetching books from Google Books API',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};


export const addBookToLibrary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { googleId, targetType, clubId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'User is not authenticated' });
        return;
    }

    try {
        const userObjectId = new Types.ObjectId(userId);
        let book = await Book.findOne({ googleId });

        if (!book) {
            const response = await axios.get<{ volumeInfo: GoogleBook['volumeInfo'] }>(
                `${GOOGLE_BOOKS_API_URL}/${googleId}`
            );
            const bookData = response.data.volumeInfo;

            book = new Book({
                googleId,
                title: bookData.title,
                authors: bookData.authors || [],
                description: bookData.description || 'No description available',
                thumbnail: bookData.imageLinks?.thumbnail || '',
                addedByUser: userObjectId,
            });

            await book.save();
        }

        if (targetType === 'user') {
            await User.findByIdAndUpdate(userObjectId, {
                $addToSet: { library: book._id },
            });
        } else if (targetType === 'club') {
            if (!clubId) {
                res.status(400).json({ message: 'Club ID is required for club target' });
                return;
            }

            const clubObjectId = new Types.ObjectId(clubId);
            const club = await Club.findById(clubObjectId);

            if (!club) {
                res.status(404).json({ message: 'Club not found' });
                return;
            }

            if (String(club.owner) !== userId) {
                res.status(403).json({ message: 'You are not authorized to add books to this club' });
                return;
            }

            await Club.findByIdAndUpdate(clubObjectId, {
                $addToSet: { library: book._id },
            });
        } else {
            res.status(400).json({ message: 'Invalid target type' });
            return;
        }

        res.status(201).json({ message: 'Book added successfully', book });
    } catch (error: unknown) {
        console.error('Error adding book to library:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error adding book to library' });
    }
};

