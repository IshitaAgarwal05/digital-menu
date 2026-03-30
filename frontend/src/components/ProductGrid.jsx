import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], onProductClick }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            className="menu-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {products && products.map(product => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => onProductClick(product)}
                />
            ))}
        </motion.div>
    );
};

export default ProductGrid;
