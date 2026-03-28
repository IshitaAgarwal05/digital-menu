import React, { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';

const SearchBar = () => {
    const { searchTerm, setSearchTerm } = useContext(FilterContext);

    return (
        <div className="control-chip">
            🔍 <input
                type="text"
                placeholder="Search ice creams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
