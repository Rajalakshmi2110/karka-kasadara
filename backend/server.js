const http = require('http');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:5173" // Replace with your React app's URL
}));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Start Video Call (Offer)
  socket.on('startCall', ({ roomId, userEmail }) => {
    // Notify other users in the room that someone started a call
    socket.to(roomId).emit('startCall', { userEmail });
    console.log(`User ${userEmail} started a call in room ${roomId}`);
  });

  // Join Video Call (Answer)
  socket.on('joinCall', ({ roomId, userEmail }) => {
    // Notify others that the user is joining the call
    socket.to(roomId).emit('joinCall', { userEmail });
    console.log(`User ${userEmail} is joining the call in room ${roomId}`);
  });

  // Handle Sending Video Offer (WebRTC)
  socket.on('offer', ({ offer, roomId }) => {
    // Forward the offer to other participants in the room
    socket.to(roomId).emit('offer', offer);
    console.log(`Offer sent to room ${roomId}`);
  });

  // Handle Answer (WebRTC)
  socket.on('answer', ({ answer, roomId }) => {
    // Forward the answer to the offerer
    socket.to(roomId).emit('answer', answer);
    console.log(`Answer sent to room ${roomId}`);
  });

  // Handle ICE Candidate (WebRTC)
  socket.on('ice-candidate', ({ candidate, roomId }) => {
    // Forward ICE candidates to other participants in the room
    socket.to(roomId).emit('ice-candidate', candidate);
    console.log(`ICE Candidate sent to room ${roomId}`);
  });

  // Handle User Disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
