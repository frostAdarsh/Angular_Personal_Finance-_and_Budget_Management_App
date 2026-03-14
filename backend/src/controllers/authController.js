const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

// Helper function to generate JWT
const generateToken = (id) => {
    // Safety check to instantly warn you if your .env is missing the secret
    if (!process.env.JWT_SECRET) {
        console.error("🚨 CRITICAL ERROR: JWT_SECRET is not defined in your .env file!");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide an email and password' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        // Return 400 (Bad Request) explicitly with JSON
        return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create the user
    try {
        const user = await User.create({ email, password });

        // 4. Send successful response (matching your Angular AuthResponse model)
        res.status(201).json({ 
            _id: user._id, 
            email: user.email, 
            isPro: user.isPro || false, 
            token: generateToken(user._id) 
        });
    } catch (error) {
        // If MongoDB or bcrypt fails, log the EXACT reason in the terminal
        console.error("🔥 REGISTRATION ERROR:", error.message);
        res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide an email and password' });
    }

    try {
        // 2. Find user by email
        const user = await User.findOne({ email });

        // 3. Check if user exists AND password matches
        if (user && (await user.matchPassword(password))) {
            res.json({ 
                _id: user._id, 
                email: user.email, 
                isPro: user.isPro || false, 
                token: generateToken(user._id) 
            });
        } else {
            // Return 401 (Unauthorized) explicitly with JSON
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("🔥 LOGIN ERROR:", error.message);
        res.status(500).json({ message: 'Server error during login: ' + error.message });
    }
});