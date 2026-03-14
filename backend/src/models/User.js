const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPro: { type: Boolean, default: false },        
    stripeCustomerId: { type: String }               
}, { timestamps: true });

// 🚀 Modern Async Hook - Notice we removed 'next' completely!
userSchema.pre('save', async function () {
    // If password is not modified, just return to let Mongoose continue
    if (!this.isModified('password')) {
        return; 
    }
    
    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);