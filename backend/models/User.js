const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
