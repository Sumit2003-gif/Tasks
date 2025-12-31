const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Security
const morgan = require("morgan"); // Logging
const rateLimit = require("express-rate-limit"); // Scalability
const dotenv = require("dotenv");
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- SECURITY & LOGGING MIDDLEWARE ---
app.use(helmet()); 
app.use(morgan("dev")); 
app.use(express.json());
app.use(cors());

// Rate Limiting (Scalability Feature)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});
app.use("/api/", limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/task', require('./routes/taskRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    msg: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));