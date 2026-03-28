const express = require('express');
const router = express.Router();
const { addOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrder);
router.get('/myorders', protect, getMyOrders);

module.exports = router;
