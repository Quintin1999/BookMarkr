//backend/server.ts

import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './db';
dotenv.config(); 

connectDB();

import express from 'express';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';
import clubRoutes from './routes/clubRoutes';
import taskRoutes from './routes/taskRoutes';
import commentRoutes from './routes/commentRoutes';
import userRoutes from './routes/userRoutes';


const app = express(); 

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoutes);  // Book routes
app.use('/api/auth', authRoutes);   // Auth routes
app.use('/api/club', clubRoutes);   // Club routes
app.use('/api/tasks', taskRoutes);  // Task routes
app.use('/api/comments', commentRoutes);  // Comment routes
app.use('/api/users', userRoutes);  // User routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
