const connectToMongo = require("./db");
const express = require("express");
connectToMongo();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const path = require('path');
require('dotenv').config()

const app = express();
app.use(express.json())
app.use(cors());

// console.log(process.env.JWT_SECRET);
// Serve uploaded files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", require("./routes/api/auth"));

app.use("/api/profile", require("./routes/api/profile"));

app.use("/api/posts", require("./routes/api/post"));

app.use("/api/like", require("./routes/api/like"));

app.use("/api/comments", require("./routes/api/comment"));

app.use("/api/users", require("./routes/api/follow"));

app.use("/api/conversations", require("./routes/api/conversation"));

app.use("/api/messages", require("./routes/api/message"));

app.use("/api/notifications", require("./routes/api/notification"));

app.get("/hello", (req, res) => {
  res.json({message: "Hello from server!"});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});