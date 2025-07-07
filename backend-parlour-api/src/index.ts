"console.log('Backend API running');" 

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import employeeRoutes from './routes/employee';
import taskRoutes from './routes/task';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import attendanceRoutes from './routes/attendance';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);

const server = http.createServer(app);
const io = new SocketIOServer(server, { 
  cors: { 
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  } 
});
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
