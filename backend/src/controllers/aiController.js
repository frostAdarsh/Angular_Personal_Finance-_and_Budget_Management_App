const { GoogleGenerativeAI } = require('@google/generative-ai');
const catchAsync = require('../utils/catchAsync');

// 1. Initialize the Gemini API
// Make sure you have GEMINI_API_KEY in your .env file!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAiInsights = catchAsync(async (req, res) => {
    // Safety check for the API key
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ ERROR: GEMINI_API_KEY is missing from .env");
        return res.status(500).json({ message: "Gemini API key is missing from server configuration." });
    }

    try {
        // 2. THE FIX: Upgraded the model string to the current active API version!
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 3. Create the prompt 
        const prompt = `
            You are an expert financial advisor. 
            The user (${req.user.email}) is asking for financial insights.
            Please provide 3 actionable, friendly, and concise tips on how to save money, 
            invest wisely, and stick to a monthly budget. Keep the formatting clean using bullet points.
        `;

        // 4. Send the prompt to Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 5. Send the AI text back to your Angular frontend
        res.json({ insight: responseText });

    } catch (error) {
        console.error("🔥 GEMINI AI ERROR:", error.message);
        res.status(500).json({ message: "Failed to generate AI insights." });
    }
});