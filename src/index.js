const express = require("express");
const connectDB = require("./config/db");
const swaggerSetup  = require("./config/swagger");
const cors = require('cors');
const app = express();

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Cho phép truy cập từ frontend
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));


// Swagger
swaggerSetup (app);

// Routes
app.use('/api', require('./routes'));


// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});