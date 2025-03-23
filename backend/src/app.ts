import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './utils/db';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import generateRoutes from './routes/generate';

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/generate', generateRoutes);

// Error handling
app.use(errorHandler);

// Connect to database
connectToDatabase(); 