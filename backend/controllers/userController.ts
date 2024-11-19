// backend/controllers/userController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/userSchema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

type UserObject = Omit<IUser, 'password'> & { password?: string };
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const userObject = newUser.toObject() as UserObject;
        delete userObject.password;

        res.status(201).json({ message: 'User created successfully', user: userObject });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error creating user' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userObject = user.toObject() as UserObject;
        delete userObject.password;

        res.status(200).json({ message: 'Login successful', token, user: userObject });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error logging in' });
    }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id; 
    const { username, email, password } = req.body;

    try {
        const updateData: Partial<{ username: string; email: string; password: string }> = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};


export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Error deleting user account', error });
    }
};
export const getUserLibrary = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthenticatedRequest).user?.id;

    try {
        const user = await User.findById(userId).populate('library', 'title authors thumbnail description');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user.library);
    } catch (error) {
        console.error('Error fetching user library:', error);
        res.status(500).json({ message: 'Error fetching user library' });
    }
};
export const deleteBookFromUserLibrary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { bookId } = req.params; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const updatedLibrary = user.library.filter((id) => id.toString() !== bookId);
        user.library = updatedLibrary;

        await user.save();

        res.status(200).json({ message: 'Book removed from library successfully' });
    } catch (error) {
        console.error('Error removing book from library:', error);
        res.status(500).json({ message: 'Error removing book from library' });
    }
};