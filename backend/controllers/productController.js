const Product = require('../models/Product');

// @desc    Get all products (with pagination, filtering, searching, sorting)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    console.log('GET /api/products - Incoming Query:', req.query);
    try {
        const { page = 1, limit = 12, category, brand, search, sortBy, flavor, skip: skipParam } = req.query;

        const query = { available: true };

        const normCategory = category ? category.toString().trim().toLowerCase() : '';

        if (normCategory === 'new arrivals') {
            query.launchingyear = { $ne: null };
        } else if (normCategory === 'discounts') {
            // Mirror the frontend rule: show badge when mrp exists and mrp > price
            query.mrp = { $gt: 0 };
            query.$expr = { $gt: ['$mrp', '$price'] };
        } else if (normCategory && normCategory !== 'all items') {
            query.category = category;
        }

        if (brand && brand !== 'All Brands') {
            query.brand = brand;
        }

        if (flavor) {
            // Case-insensitive regex match on product name for flavor keyword
            query.name = { $regex: flavor, $options: 'i' };
        }

        if (search) {
            query.$text = { $search: search };
        }

        let sort = {};
        if (sortBy === 'low-high') sort.price = 1;
        else if (sortBy === 'high-low') sort.price = -1;
        else if (sortBy === 'disc-high-low') sort.discount = -1;
        else sort.launchingyear = -1; // Default: show newest first

        const skip = skipParam !== undefined ? Number(skipParam) : (page - 1) * limit;

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
