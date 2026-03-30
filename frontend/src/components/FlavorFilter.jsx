import React, { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';

const FLAVORS = [
    { id: 'chocolate', label: 'Chocolate', emoji: '🍫' },
    { id: 'mango', label: 'Mango', emoji: '🥭' },
    { id: 'strawberry', label: 'Strawberry', emoji: '🍓' },
    { id: 'vanilla', label: 'Vanilla', emoji: '🍦' },
    { id: 'mint', label: 'Mint', emoji: '🌿' },
    { id: 'butterscotch', label: 'Butterscotch', emoji: '🧈' },
    { id: 'kesar', label: 'Kesar', emoji: '🌸' },
    { id: 'kulfi', label: 'Kulfi', emoji: '🍧' },
    { id: 'rabri', label: 'Classic', emoji: '🥛' }
];

const FlavorFilter = () => {
    const { flavorFilter, setFlavorFilter } = useContext(FilterContext);

    return (
        <div className="flavor-bar">
            <div
                className={`flavor-chip-item ${flavorFilter === '' ? 'active' : ''}`}
                onClick={() => setFlavorFilter('')}
            >
                All
            </div>
            {FLAVORS.map(f => (
                <div
                    key={f.id}
                    className={`flavor-chip-item ${flavorFilter === f.id ? 'active' : ''}`}
                    onClick={() => setFlavorFilter(f.id)}
                >
                    <span className="flavor-emoji">{f.emoji}</span>
                    <span className="flavor-label">{f.label}</span>
                </div>
            ))}
        </div>
    );
};

export default FlavorFilter;
