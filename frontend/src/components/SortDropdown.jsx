import React, { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';

const SortDropdown = () => {
    const { sortBy, setSortBy } = useContext(FilterContext);

    return (
        <div className="control-chip">
            ↕️ <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort by relevance</option>
                <option value="disc-high-low">Discount: High - Low</option>
                <option value="low-high">Price: Low - High</option>
                <option value="high-low">Price: High - Low</option>
                <option value="vol-low-high">Size: Small - Large</option>
                <option value="vol-high-low">Size: Large - Small</option>
            </select>
        </div>
    );
};

export default SortDropdown;
