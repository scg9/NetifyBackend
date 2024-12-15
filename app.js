const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const showRoutes = require('./routes/showRoutes');  // Correct import

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/shows', showRoutes);  // Ensure this is registered

// MongoDB Connection
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next({
    data : {},
    err : {
      msg : 'Not Found'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



