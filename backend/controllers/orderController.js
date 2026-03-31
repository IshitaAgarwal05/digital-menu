const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrder = async (req, res) => {
    const { items, totalAmount, itemsSummary, orderType, deliveryAddress } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    // Calculate delivery charge logic
    let deliveryCharge = 0;
    if (orderType === 'delivery') {
        deliveryCharge = totalAmount >= 1000 ? 0 : 80;
    }

    const order = new Order({
        userId: req.user._id,
        items,
        totalAmount,
        itemsSummary,
        orderType: orderType || 'pickup',
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        deliveryCharge,
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = { addOrder, getMyOrders, updateOrderStatus };
