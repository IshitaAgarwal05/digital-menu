import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
    return (
        <motion.div
            className="menu-grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {products && products.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </motion.div>
    );
};

export default ProductGrid;
