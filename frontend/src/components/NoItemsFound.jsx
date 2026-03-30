import React from 'react';
import { motion } from 'framer-motion';

const NoItemsFound = ({ onClear }) => {
    return (
        <motion.div
            className="no-items-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="no-items-icon">🍦</div>
            <h3 className="no-items-h3">No items found</h3>
            <p className="no-items-p">We couldn't find any scoops matching your current filters. Try changing them!</p>
            <button className="clear-filters-btn" onClick={onClear}>Clear All Filters</button>
        </motion.div>
    );
};

export default NoItemsFound;
