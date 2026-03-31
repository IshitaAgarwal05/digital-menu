const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [{
        label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        fullName: String,
        phone: String,
        house: String,
        street: String,
        landmark: String,
        city: String,
        pincode: String,
        instructions: String,
        latitude: Number,
        longitude: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
