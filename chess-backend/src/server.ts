import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables once
dotenv.config();

// Constants from environment
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chessdb';

// Initialize Express app
const app: Application = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new SocketIOServer(server, {
    cors: {
        origin: '*', // Replace with frontend URL in production
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/status', (_req: Request, res: Response) => {
    res.json({ status: 'Chess backend running ✅' });
});

// Global error handler middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Socket.IO logic
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join_game', (data) => {
        console.log(`Player ${socket.id} joined game`, data);
        // Add matchmaking/game join logic here
    });

    socket.on('move_piece', (moveData) => {
        console.log(`Move received:`, moveData);
        // Validate and broadcast move to opponent
        socket.broadcast.emit('opponent_move', moveData);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err);
    });
