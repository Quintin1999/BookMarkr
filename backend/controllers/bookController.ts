// backend/controllers/bookController.ts

import axios from 'axios';
import Book from '../models/bookSchema';
import { Request, Response } from 'express';

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

export const searchBooks = async (req: Request, res: Response) => {
    const { query } = req.query;

    try {
        const response = await axios.get(GOOGLE_BOOKS_API_URL, {
            params: {
                q: query,
                key: process.env.GOOGLE_BOOKS_API_KEY,
            }
        });

        const books = response.data.items.map((book: GoogleBook) => ({
            googleId: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || [],
            description: book.volumeInfo.description || 'No description available',
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
        }));

        res.status(200).json(books);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error fetching books from Google Books API' });
        }
    }
};

export const addBookToLibrary = async (req: Request, res: Response) => {
    const { googleId, userId } = req.body;

    try {
        let book = await Book.findOne({ googleId });

        if (!book) {
            const response = await axios.get<{ volumeInfo: GoogleBook['volumeInfo'] }>(`${GOOGLE_BOOKS_API_URL}/${googleId}`);
            const bookData = response.data.volumeInfo;

            book = new Book({
                googleId,
                title: bookData.title,
                authors: bookData.authors || [],
                description: bookData.description || 'No description available',
                thumbnail: bookData.imageLinks?.thumbnail || '',
                addedByUser: userId,
            });

            await book.save();
        }

        res.status(201).json({ message: 'Book added to library successfully', book });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error adding book to library' });
        }
    }
};
