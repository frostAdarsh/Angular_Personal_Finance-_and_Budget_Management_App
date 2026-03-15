const Groq = require("groq-sdk");
const Transaction = require("../models/Transaction");

exports.getAiInsights = async (req, res) => {

  try {

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Fetch user transactions
    const transactions = await Transaction.find({
      user: req.user.id
    });

    // Calculate category totals
    const categoryTotals = {};

    transactions.forEach(t => {
      const category = t.category;

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += t.amount;
    });

    const expenseSummary = Object.entries(categoryTotals)
      .map(([cat, amount]) => `${cat}: ₹${amount}`)
      .join("\n");

    const prompt = `
You are a financial advisor.

User expense summary:

${expenseSummary}

Analyze spending habits and provide:
1. 3 insights about spending
2. 2 ways to save money
3. 1 investment tip
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      insight: aiResponse
    });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      message: "AI generation failed"
    });

  }
};