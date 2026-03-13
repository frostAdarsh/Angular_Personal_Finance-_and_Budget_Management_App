const { GoogleGenAI } = require('@google/genai');
const Transaction = require('../models/Transaction');
const catchAsync = require('../utils/catchAsync');

const ai = new GoogleGenAI({});

exports.getFinancialInsights = catchAsync(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user.id })
        .sort({ date: -1 })
        .limit(30);

    if (transactions.length === 0) {
        return res.json({ insight: "You don't have enough transactions yet for AI analysis. Start logging!" });
    }

    const promptData = transactions
        .map(t => `${t.date.toISOString().split('T')[0]}: ${t.type.toUpperCase()} of $${t.amount} for ${t.category}`)
        .join('\n');
    
    const prompt = `
        You are an expert financial advisor analyzing a client's recent transaction history. 
        Based on the data below, provide a short, actionable, 3-bullet-point summary of their spending habits. 
        Suggest one specific area where they can save money. Keep the tone encouraging and professional.
        
        Recent Transactions:
        ${promptData}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    res.json({ insight: response.text });
});