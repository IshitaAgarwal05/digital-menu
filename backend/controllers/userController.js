const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            phone: user.phone,
            name: user.name,
            addresses: user.addresses,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.address = req.body.address || user.address;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            phone: updatedUser.phone,
            name: updatedUser.name,
            address: updatedUser.address,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Add new address
// @route   POST /api/users/address
// @access  Private
const addAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.addresses.push(req.body);
        const updatedUser = await user.save();
        res.status(201).json(updatedUser.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update address
// @route   PUT /api/users/address/:id
// @access  Private
const updateAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const address = user.addresses.id(req.params.id);
        if (address) {
            Object.assign(address, req.body);
            const updatedUser = await user.save();
            res.json(updatedUser.addresses);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.addresses.pull(req.params.id);
        await user.save();
        res.json({ message: 'Address removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUserProfile, updateUserProfile, addAddress, updateAddress, deleteAddress };
