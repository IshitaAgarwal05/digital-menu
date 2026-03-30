import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="menu-card skeleton-card">
            <div className="card-img-wrapper skeleton-bg" style={{ height: '160px', width: '100%', borderRadius: '12px' }}></div>
            <div className="skeleton-bg" style={{ height: '12px', width: '40%', marginBottom: '10px', marginTop: '15px', borderRadius: '4px' }}></div>
            <div className="skeleton-bg" style={{ height: '20px', width: '80%', marginBottom: '10px', borderRadius: '4px' }}></div>
            <div className="skeleton-bg" style={{ height: '15px', width: '30%', marginBottom: '20px', borderRadius: '4px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div className="skeleton-bg" style={{ height: '25px', width: '35%', borderRadius: '4px' }}></div>
                <div className="skeleton-bg" style={{ height: '36px', width: '36px', borderRadius: '50%' }}></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
