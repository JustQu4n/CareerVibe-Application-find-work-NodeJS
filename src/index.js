const express = require("express");
const connectDB = require("./config/db");
const swaggerSetup  = require("./config/swagger");
const cors = require('cors');
const app = express();

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(express.json());
app.use(cors());


// Swagger
swaggerSetup (app);

// Routes
// const authRoutes = require('./routes/AuthRoutes');
// app.use('/api/auth', authRoutes);
// const jobSeeker = require('./routes/JobSeeker/JobSeekerRoutes');
// app.use('/api/users', jobSeeker);
app.use('/api', require('./routes'));


// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});