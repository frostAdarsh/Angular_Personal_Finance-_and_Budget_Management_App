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
app.use(cors());


app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

module.exports = app;