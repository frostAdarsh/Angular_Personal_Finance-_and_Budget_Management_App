const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.registerUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ email, password });
    res.status(201).json({ _id: user._id, email: user.email, token: generateToken(user._id) });
});

exports.loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({ _id: user._id, email: user.email, token: generateToken(user._id) });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});