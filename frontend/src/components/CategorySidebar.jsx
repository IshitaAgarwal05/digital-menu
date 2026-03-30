import React, { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { FilterContext } from '../context/FilterContext';

const CategorySidebar = () => {
    const [categories, setCategories] = useState(['New Arrivals', 'All Items', 'Discounts']);
    const { currentCategory, setCurrentCategory } = useContext(FilterContext);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/products/filters');
                setCategories(['New Arrivals', 'All Items', 'Discounts', ...data.categories]);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        fetchCategories();
    }, []);

    const getCategoryIcon = (cat) => {
        const lCat = cat.toLowerCase();
        if (lCat === 'new arrivals') return '🔥';
        if (lCat === 'all items') return '🍨';
        if (lCat === 'discounts') return '%';
        if (lCat.includes('family') || lCat.includes('pack')) return '📦';
        if (lCat.includes('tub')) return '🪣';
        if (lCat.includes('cone')) return '🍦';
        if (lCat.includes('stick') || lCat.includes('bar')) return '🍡';
        if (lCat.includes('cake') || lCat.includes('slice')) return '🍰';
        if (lCat.includes('cup') || lCat.includes('sundae')) return '🍧';
        return '🍨';
    };

    return (
        <aside className="sidebar">
            {categories.map(cat => (
                <div
                    key={cat}
                    className={`cat-item ${currentCategory === cat ? 'active' : ''}`}
                    onClick={() => setCurrentCategory(cat)}
                >
                    <div className="cat-icon">{getCategoryIcon(cat)}</div>
                    <div className="cat-name">{cat}</div>
                </div>
            ))}
        </aside>
    );
};

export default CategorySidebar;
