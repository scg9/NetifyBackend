const express = require('express');
const { getShows, getShowDetails } = require('../controllers/showController');
const protect = require('../middleware/authMiddleware');
const refreshJWT = require('../middleware/refreshJWT');

const router = express.Router();

router.get('/', protect, refreshJWT, getShows); // Protect and refresh JWT
router.get('/:show_id', protect, refreshJWT, getShowDetails); // Protect and refresh JWT

module.exports = router;

