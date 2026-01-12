const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Config
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

app.set('io', io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies
};
app.use(cors(corsOptions));

// Socket.io
io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room user_${userId}`);
    }
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected');
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
