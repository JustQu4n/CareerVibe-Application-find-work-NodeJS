const express = require("express");
const connectDB = require("./database/connection");
const app = express();

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require(__dirname + "/routes/AuthRoutes");
app.use('/api/auth', authRoutes);

// Khởi động server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});