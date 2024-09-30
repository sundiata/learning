require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());



app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


