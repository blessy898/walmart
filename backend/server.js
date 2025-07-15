import dotenv from 'dotenv';

dotenv.config();
import express from 'express';

import cors from 'cors';

import connectDB from './config/db.js';
import receiptRoutes from './routes/receiptRoutes.js';


connectDB();

const app = express();

// ✅ Enable CORS before routes
app.use(cors());
app.use(express.json());

app.use('/api/receipt', receiptRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  

});
