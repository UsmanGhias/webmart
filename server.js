const connectToMongo = require("./db");
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json())
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(express.json());

app.use("/api/auth", require("./routes/api/auth"));

app.use("/api/profile", require("./routes/api/profile"));

app.use("/api/posts", require("./routes/api/post"));

app.use("/api/like", require("./routes/api/like"));

app.use("/api/comments", require("./routes/api/comment"));

app.use("/api/business", require("./routes/api/business"));

app.use("/api/products", require("./routes/api/product"));

app.use('/api/cart', require('./routes/api/cart'));

app.use('/api/orders', require('./routes/api/order'));

app.use("/api/users", require("./routes/api/follow"));

app.use("/api/conversations", require("./routes/api/conversation"));

app.use("/api/messages", require("./routes/api/message"));

app.use("/api/notifications", require("./routes/api/notification"));

app.use('/api/admin', require('./routes/admin'));

// Socket.io for real-time chat
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  
  socket.on('send-message', (data) => {
    socket.to(data.room).emit('receive-message', data);
  });
  
  socket.on('typing', (data) => {
    socket.to(data.room).emit('user-typing', data);
  });
  
  socket.on('stop-typing', (data) => {
    socket.to(data.room).emit('user-stop-typing', data);
  });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/web-mart')
  .then(() => console.log('Connected to Mongo Successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files and handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});