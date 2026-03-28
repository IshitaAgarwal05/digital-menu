const express = require('express');
const router = express.Router();
const { getProducts, getFilters } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/filters', getFilters);

module.exports = router;
