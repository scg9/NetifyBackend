const express = require('express');
const { registerUser, loginUser ,getProfile, updateProfile} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
//  routes for profile management
router.get('/getprofile', protect, getProfile); // Fetch user profile
router.put('/updateprofile', protect, updateProfile); // Update user profile

module.exports = router;
