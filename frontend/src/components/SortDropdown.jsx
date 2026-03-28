import React, { useContext, useState, useRef, useEffect } from 'react';
import { FilterContext } from '../context/FilterContext';
import { motion, AnimatePresence } from 'framer-motion';

const options = [
    { value: 'default', label: 'Relevance', icon: '✨' },
    { value: 'disc-high-low', label: 'Best Deals', icon: '🔥' },
    { value: 'low-high', label: 'Price: Low - High', icon: '📈' },
    { value: 'high-low', label: 'Price: High - Low', icon: '📉' },
    { value: 'vol-low-high', label: 'Size: Small - Large', icon: '🍦' },
    { value: 'vol-high-low', label: 'Size: Large - Small', icon: '🍨' },
];

const SortDropdown = () => {
    const { sortBy, setSortBy } = useContext(FilterContext);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentOption = options.find(opt => opt.value === sortBy) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-sort-wrapper" ref={dropdownRef}>
            <button
                className="sort-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="sort-icon-active">{currentOption.icon}</span>
                <span className="sort-label-active">{currentOption.label}</span>
                <span className={`sort-arrow ${isOpen ? 'open' : ''}`}>▾</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className="sort-options-list"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        role="listbox"
                    >
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                className={`sort-option-item ${sortBy === opt.value ? 'selected' : ''}`}
                                onClick={() => {
                                    setSortBy(opt.value);
                                    setIsOpen(false);
                                }}
                                role="option"
                                aria-selected={sortBy === opt.value}
                            >
                                <span className="opt-icon">{opt.icon}</span>
                                <span className="opt-label">{opt.label}</span>
                                {sortBy === opt.value && <span className="check-mark">✓</span>}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SortDropdown;
