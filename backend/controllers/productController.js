const Product = require('../models/Product');

// @desc    Get all products (with pagination, filtering, searching, sorting)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    console.log('GET /api/products - Incoming Query:', req.query);
    try {
        const { page = 1, limit = 12, category, brand, search, sortBy } = req.query;

        const query = { available: true };

        if (category && category !== 'All Items' && category !== 'Best Sellers') {
            query.category = category;
        } else if (category === 'Best Sellers') {
            query.bestseller = true;
        }

        if (brand && brand !== 'All Brands') {
            query.brand = brand;
        }

        if (search) {
            query.$text = { $search: search };
        }

        let sort = {};
        if (sortBy === 'low-high') sort.price = 1;
        else if (sortBy === 'high-low') sort.price = -1;
        else if (sortBy === 'disc-high-low') sort.discount = -1; // Need to calculate or store discount
        else sort.createdAt = -1;

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get unique brands and categories
// @route   GET /api/products/filters
// @access  Public
const getFilters = async (req, res) => {
    console.log('GET /api/products/filters - Request received');
    try {
        const brands = await Product.distinct('brand');
        const categories = await Product.distinct('category');
        console.log(`Found ${brands.length} brands and ${categories.length} categories.`);
        res.json({ brands, categories });
    } catch (error) {
        console.error('Error in getFilters:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getFilters
};
