import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [currentCategory, setCurrentCategory] = useState('All Items');
    const [currentBrand, setCurrentBrand] = useState('All Brands');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');

    return (
        <FilterContext.Provider value={{
            currentCategory, setCurrentCategory,
            currentBrand, setCurrentBrand,
            searchTerm, setSearchTerm,
            sortBy, setSortBy
        }}>
            {children}
        </FilterContext.Provider>
    );
};
