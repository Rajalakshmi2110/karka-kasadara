const http = require('http');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// ✅ Enable CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend port
    methods: ["GET", "POST"]
  }
});

// Optional: also allow CORS for API routes (REST endpoints)
app.use(cors({
  origin: "http://localhost:5173"
}));

// Set to track the online users
const onlineUsers = new Set(); // Store online users

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Add user to the onlineUsers set
  onlineUsers.add(socket.id);

  // Emit the updated online users list to all clients
  io.emit('onlineUsers', Array.from(onlineUsers));

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from the onlineUsers set
    onlineUsers.delete(socket.id);
    // Emit the updated online users list to all clients
    io.emit('onlineUsers', Array.from(onlineUsers));
  });
});

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
