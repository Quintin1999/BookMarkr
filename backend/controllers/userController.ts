// backend/controllers/userController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userSchema';

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

        // Use comparePassword method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Generate JWT token
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
