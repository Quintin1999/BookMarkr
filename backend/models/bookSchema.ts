//backend/models/bookSchema.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document{
    googleId: string;
    title: string;
    authors: string[];
    description: string;
    thumbnail: string;
    addedByUser: mongoose.Types.ObjectId;
    clubId?: mongoose.Types.ObjectId;
}

const BookSchema: Schema<IBook> = new Schema({
    googleId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: { type: [String], required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    addedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }
});

const Book = mongoose.model<IBook>('Book', BookSchema); 
export default Book;