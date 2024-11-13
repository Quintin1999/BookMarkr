// backend/models/clubSchema.ts

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userSchema';

export interface IClub extends Document {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId | IUser;
    roomKey: string;
    createdAt?: Date;
    members: mongoose.Types.ObjectId[];
    books: mongoose.Types.ObjectId[]; // Array to hold book references
}

const ClubSchema: Schema<IClub> = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomKey: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] // Array to hold book references
});

// Pre-save hook to generate roomKey if not provided
ClubSchema.pre<IClub>('save', async function (next) {
    if (!this.roomKey) {
        this.roomKey = Math.random().toString(36).substr(2, 10);
    }
    next();
});

const Club = mongoose.model<IClub>('Club', ClubSchema);
export default Club;
