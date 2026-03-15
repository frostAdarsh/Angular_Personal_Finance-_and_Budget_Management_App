const { GoogleGenerativeAI } = require('@google/generative-ai');
const catchAsync = require('../utils/catchAsync');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAiInsights = catchAsync(async (req, res) => {
    
    // =====================================================================
    // 🛑 TEMPORARY BYPASS: Using mock data due to Google API 'limit: 0'
    // =====================================================================
    console.log("🚀 Bypassing Gemini API and sending mock data...");

    const mockResponse = `
Here is your personalized financial plan for **${req.user.email}**:

* **Save Money:** Set up an automatic transfer to move 10% of your income to a high-yield savings account the exact day you get paid.
* **Invest Wisely:** Look into low-cost, diversified index funds for long-term, stable growth.
* **Monthly Budget:** Try the 50/30/20 rule: 50% for essential needs, 30% for lifestyle wants, and 20% dedicated strictly to savings and debt payoff.
    `;

    // 1. Safely pause the async function for 1.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 2. 🛑 CACHE BUSTER: Strictly forbid the browser from caching this request!
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // 3. Send the data
    res.json({ insight: mockResponse });

    // =====================================================================
    // 🟢 REAL AI CODE (Commented out for now. Uncomment when billing is active!)
    // =====================================================================
    /*
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Gemini API key is missing." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            You are an expert financial advisor. 
            The user (${req.user.email}) is asking for financial insights.
            Please provide 3 actionable, friendly, and concise tips on how to save money, 
            invest wisely, and stick to a monthly budget. Keep the formatting clean using bullet points.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ insight: responseText });

    } catch (error) {
        console.error("🔥 GEMINI AI ERROR:", error.message);
        res.status(500).json({ message: "Failed to generate AI insights." });
    }
    */
});