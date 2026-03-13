const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/stripeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;