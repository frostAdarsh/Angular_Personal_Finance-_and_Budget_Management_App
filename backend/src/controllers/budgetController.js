const Budget = require('../models/Budget');
const catchAsync = require('../utils/catchAsync');

exports.getBudgets = catchAsync(async (req, res) => {
    const { month, year } = req.query;
    let query = { user: req.user.id };
    
    if (month && year) {
        query.month = month;
        query.year = year;
    }

    const budgets = await Budget.find(query);
    res.json(budgets);
});

exports.setBudget = catchAsync(async (req, res) => {
    const { category, limit, month, year } = req.body;

    // Create or update existing budget for that month
    const budget = await Budget.findOneAndUpdate(
        { user: req.user.id, category, month, year },
        { limit },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(budget);
});