const express = require('express');
const router = express.Router();
const { addOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrder);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
