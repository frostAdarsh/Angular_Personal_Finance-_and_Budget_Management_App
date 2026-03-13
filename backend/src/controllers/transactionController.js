const Transaction = require('../models/Transaction');
const catchAsync = require('../utils/catchAsync');

exports.getTransactions = catchAsync(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
});

exports.createTransaction = catchAsync(async (req, res) => {
    const { type, amount, category, date, notes } = req.body;
    const transaction = await Transaction.create({
        user: req.user.id,
        type, amount, category, date, notes
    });
    res.status(201).json(transaction);
});

exports.deleteTransaction = catchAsync(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction || transaction.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('Transaction not found or unauthorized');
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
});