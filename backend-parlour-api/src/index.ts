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
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // If CORS_ORIGIN is '*', allow all origins
    if (allowedOrigins.includes('*')) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Validate required environment variables
if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  console.error('Please set MONGODB_URI in your environment variables');
  process.exit(1);
}

console.log('Starting server...');
console.log('Port:', PORT);
console.log('CORS Origin:', process.env.CORS_ORIGIN ||'http://localhost:3000');
console.log('MongoDB URI:', MONGODB_URI ? 'Configured' : 'Missing');

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

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
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];
      
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // If CORS_ORIGIN is '*', allow all origins
      if (allowedOrigins.includes('*')) return callback(null, true);
      
      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  } 
});
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close().then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
}); 
