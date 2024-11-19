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
    library: mongoose.Types.ObjectId[]; 
}

const ClubSchema: Schema<IClub> = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomKey: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] 
});

ClubSchema.pre<IClub>('save', async function (next) {
    if (!this.roomKey) {
        this.roomKey = Math.random().toString(36).substr(2, 10);
    }
    next();
});

const Club = mongoose.model<IClub>('Club', ClubSchema);
export default Club;
