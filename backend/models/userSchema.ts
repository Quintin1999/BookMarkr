// backend/models/userSchema.ts

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
    joinedClubs: mongoose.Types.ObjectId[]; // Clubs joined by the user
    createdClubs: mongoose.Types.ObjectId[]; // Clubs created by the user
    library: mongoose.Types.ObjectId[]; // Books in the user's personal library
}

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }], // Clubs joined
    createdClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }], // Clubs created by the user
    library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Personal library of books
});

UserSchema.pre('save', async function (this: IUser, next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
