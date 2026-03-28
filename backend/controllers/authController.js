const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Send OTP (Mock)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    try {
        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ phone });
        }

        // Mock OTP: 123456
        const otp = '123456';
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        console.log(`OTP for ${phone}: ${otp}`);
        res.json({ message: 'OTP sent successfully (Mock: 123456)' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    try {
        const user = await User.findOne({ phone, otp, otpExpires: { $gt: new Date() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            _id: user._id,
            phone: user.phone,
            name: user.name,
            address: user.address,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { sendOTP, verifyOTP };
