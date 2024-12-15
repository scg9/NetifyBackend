const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const refreshJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the userId from the token
    const user = await User.findById(decoded.userId);
    console.log("user",user)
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if the token matches the one stored in the database
    if (user.jwt !== token) {
      return res.status(401).json({ message: 'Token mismatch. Please log in again.' });
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeRemaining = decoded.exp - currentTime;

    if (timeRemaining < 300) { // 300 seconds = 5 minutes
      // Generate a new token
      const newToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

         // Save the new token in the database
      user.jwt = newToken;
      await user.save();

      // Add the new token to the response headers for the client
      res.setHeader('Authorization', `Bearer ${newToken}`);
    }
    req.user = { userId: user._id }; // Attach user ID to request object

    next();
  } catch (error) {
    console.error('JWT refresh failed:', error.message);
    res.status(401).json({ message: 'Not authorized, token refresh failed' });
  }
};

module.exports = refreshJWT;
