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
const corsOrigin = process.env.CORS_ORIGIN || '*';
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (corsOrigin === '*') {
      return callback(null, true);
    }
    
    const allowedOrigins = corsOrigin.split(',').map(o => o.trim());
    
    // Check if the origin is in the allowed list or if it's a Vercel preview URL
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers for production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
}

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Validate required environment variables
if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  console.error('Please set MONGODB_URI in your environment variables');
  process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
  console.error('JWT_SECRET environment variable is required and must be changed from default');
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
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);
      
      const corsOrigin = process.env.CORS_ORIGIN || '*';
      if (corsOrigin === '*') {
        return callback(null, true);
      }
      
      const allowedOrigins = corsOrigin.split(',').map(o => o.trim());
      
      // Check if the origin is in the allowed list or if it's a Vercel preview URL
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST']
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
