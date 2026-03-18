const express = require('express');
const cors = require('cors');

const { errorHandler } = require('./middlewares/errorMiddleware');
const { stripeWebhook } = require('./controllers/stripeController');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();


// ✅ CORS CONFIGURATION
app.use(
  cors({
    origin: [
      "http://localhost:4200", // local Angular dev
      process.env.FRONTEND_URL // deployed frontend
    ],
    credentials: true
  })
);


// ✅ Stripe Webhook (must come BEFORE express.json)
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);


// ✅ JSON parser for all other routes
app.use(express.json());


// ✅ API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/ai', aiRoutes);


// ✅ GLOBAL ERROR HANDLER
app.use(errorHandler);


module.exports = app;