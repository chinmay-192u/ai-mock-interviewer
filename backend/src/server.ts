import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { connectDatabase } from './config/database.js';
import interviewRoutes from './routes/interviewRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Mock Interviewer backend is running',
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
