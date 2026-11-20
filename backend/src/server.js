import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import setupClassroomSocket from './socket/classroomSocket.js';

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup Socket.io for live small-batch classrooms
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupClassroomSocket(io);

server.listen(PORT, () => {
  console.log(`
  ======================================================
  🎓 CLASSIFY BACKEND SERVER RUNNING
  ------------------------------------------------------
  📡 Port:            ${PORT}
  🌍 Environment:     ${process.env.NODE_ENV || 'development'}
  🔗 API Health:      http://localhost:${PORT}/api/health
  👥 Live Classroom:  Socket.io Enabled
  ======================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
