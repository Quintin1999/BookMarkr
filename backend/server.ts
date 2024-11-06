import dotenv from 'dotenv';
dotenv.config(); // This loads the variables from your .env file into process.env

import express from 'express';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';
import cludRoutes from './routes/clubRoutes';   

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/club', cludRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));