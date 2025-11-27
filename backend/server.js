const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');

// Import route files
const userRoutes = require('./routes/user');
const empRoutes = require('./routes/employee');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // allows JSON in request body
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', empRoutes);

// Generic error handler to capture multer and other runtime errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error.' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
