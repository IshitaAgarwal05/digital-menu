const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrder = async (req, res) => {
    const { items, totalAmount, itemsSummary } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    const order = new Order({
        userId: req.user._id,
        items,
        totalAmount,
        itemsSummary,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(10);
    res.json(orders);
};

module.exports = { addOrder, getMyOrders };
