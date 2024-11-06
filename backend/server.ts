import dotenv from 'dotenv';
dotenv.config(); // This loads the variables from your .env file into process.env

import express from 'express';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));