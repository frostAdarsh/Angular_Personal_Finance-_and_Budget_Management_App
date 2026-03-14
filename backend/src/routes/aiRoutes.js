const express = require('express');
const router = express.Router();

// 1. THE FIX: Changed to getAiInsights to match your controller!
const { getAiInsights } = require('../controllers/aiController');
const { protect, requirePro } = require('../middlewares/authMiddleware');

// 2. THE FIX: Used getAiInsights here too
router.get('/insights', protect, requirePro, getAiInsights);

module.exports = router;