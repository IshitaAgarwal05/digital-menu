import React, { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { FilterContext } from '../context/FilterContext';

const brandImageLinks = {
    "baskin robbins": "https://i.postimg.cc/j5FTdyfz/brlogo.png",
    "london dairy": "https://i.postimg.cc/jdtSC4nV/LD-logo.png",
    "mother dairy": "https://i.postimg.cc/4dSGNpcB/md_logo.png",
    "amul": "https://via.placeholder.com/100/e44d26/ffffff?text=Amul",
    "kwality": "https://i.postimg.cc/ncGM1PfV/kw_logo.png",
    "walls": "https://i.postimg.cc/ncGM1PfV/kw_logo.png",
    "gianis": "https://i.postimg.cc/L6kw6Gr2/lgo-gianis.png",
    "havmor": "https://i.postimg.cc/KvD45HhZ/logo_havmor.png",
    "hocco": "https://i.postimg.cc/CLsd4Qph/hocco_logo.png",
    "frubon": "https://i.postimg.cc/0y5Q0rM3/logo_fb.png"
};

const BrandFilter = () => {
    const [brands, setBrands] = useState(['All Brands']);
    const { currentBrand, setCurrentBrand } = useContext(FilterContext);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const { data } = await api.get('/products/filters');
                setBrands(['All Brands', ...data.brands]);
            } catch (error) {
                console.error('Error fetching brands', error);
            }
        };
        fetchBrands();
    }, []);

    const getBrandLogo = (brandName) => {
        if (brandName === 'All Brands') {
            return (
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', background: 'var(--main-bg)' }}>
                    <text x="50" y="55" fontSize="28" fill="var(--glacier-blue)" fontWeight="bold" fontFamily="Montserrat, sans-serif" textAnchor="middle" dominantBaseline="middle">ALL</text>
                </svg>
            );
        }
        const b = brandName.toLowerCase();
        let matchedImg = '';
        for (let key in brandImageLinks) {
            if (b.includes(key)) {
                matchedImg = brandImageLinks[key];
                break;
            }
        }
        if (matchedImg) return <img src={matchedImg} alt={brandName} />;
        let text = brandName.substring(0, 2).toUpperCase();
        return (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', background: 'var(--main-bg)' }}>
                <text x="50" y="55" fontSize="34" fill="var(--text-secondary)" fontWeight="bold" fontFamily="Montserrat, sans-serif" textAnchor="middle" dominantBaseline="middle">{text}</text>
            </svg>
        );
    };

    return (
        <div className="brands-row">
            {brands.map(brand => (
                <div key={brand} className={`brand-item ${currentBrand === brand ? 'active' : ''}`} onClick={() => setCurrentBrand(brand)}>
                    <div className="brand-icon">
                        {getBrandLogo(brand)}
                    </div>
                    <div className="brand-name">{brand === 'All Brands' ? 'All' : brand}</div>
                </div>
            ))}
        </div>
    );
};

export default BrandFilter;
