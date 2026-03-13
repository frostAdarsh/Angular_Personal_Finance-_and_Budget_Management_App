const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }
        return next();
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});


exports.requirePro = (req, res, next) => {
    if (req.user && req.user.isPro) {
        next();
    } else {
        res.status(403);
        throw new Error('Upgrade to Pro to access this feature');
    }
};