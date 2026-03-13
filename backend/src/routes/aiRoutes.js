const express = require('express');
const router = express.Router();
const { getFinancialInsights } = require('../controllers/aiController');
const { protect, requirePro } = require('../middlewares/authMiddleware');


router.get('/insights', protect, requirePro, getFinancialInsights);

module.exports = router;