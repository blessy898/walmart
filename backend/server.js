import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import receiptRoutes from './routes/receiptRoutes.js';
import authRoutes from './routes/authRoutes.js';; // ✅

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/receipt', receiptRoutes);
app.use('/api/user', authRoutes); // ✅

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
