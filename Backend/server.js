const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer);

// Set up CORS for your entire app
app.use(cors({
    origin: 'https://socketchat-orpin.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
}));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User with id-${socket.id} joined room - ${roomId}`);
    });

    socket.on('send_msg', (data) => {
        console.log(data, 'DATA');
        // This will send a message to a specific room ID
        socket.to(data.roomId).emit('receive_msg', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });

    socket.on('receive_msg', (data) => {
        console.log('Received a message:', data);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});
