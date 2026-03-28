const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ timestamp: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find({});
        const totalSales = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Basic sales by brand
        const brandSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                brandSales[item.brand] = (brandSales[item.brand] || 0) + (item.price * item.qty);
            });
        });

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalSales,
            brandSales
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
