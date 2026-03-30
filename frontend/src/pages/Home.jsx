import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import SkeletonCard from '../components/SkeletonCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { FilterContext } from '../context/FilterContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { currentCategory, currentBrand, searchTerm, sortBy } = useContext(FilterContext);
    const { ref, inView } = useInView();

    const fetchProducts = useCallback(async (pageNum, isNewFilter = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await api.get('/products', {
                params: {
                    page: pageNum,
                    limit: 12,
                    category: currentCategory,
                    brand: currentBrand,
                    search: searchTerm,
                    sortBy: sortBy
                }
            });

            if (data && data.products) {
                if (isNewFilter) {
                    setProducts(data.products);
                } else {
                    setProducts(prev => {
                        const existingIds = new Set(prev.map(p => p._id));
                        const uniqueNew = data.products.filter(p => !existingIds.has(p._id));
                        return [...prev, ...uniqueNew];
                    });
                }
                setHasMore(data.page < data.pages);
                setTotalItems(data.total);
            }
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    }, [currentCategory, currentBrand, searchTerm, sortBy]);

    // Reset and fetch when filters change
    useEffect(() => {
        setPage(1);
        fetchProducts(1, true);
    }, [currentCategory, currentBrand, searchTerm, sortBy, fetchProducts]);

    // Load more when scrolling
    useEffect(() => {
        if (inView && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(nextPage);
        }
    }, [inView, hasMore, loading, page, fetchProducts]);

    return (
        <main className="content-area">
            <div className="controls-bar">
                <SearchBar />
                <SortDropdown />
            </div>

            <div className="section-header">
                <h2>{currentBrand !== 'All Brands' ? `${currentBrand} ` : ''}{searchTerm ? 'Search Results' : currentCategory}</h2>
                <span className="section-count">{totalItems} items</span>
            </div>

            {loading && products.length === 0 ? (
                <div className="menu-grid">
                    {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <ProductGrid products={products} onProductClick={(p) => setSelectedProduct(p)} />
            )}

            {loading && products.length > 0 && (
                <div className="loading-more-trigger skeleton-bg" style={{ height: '40px', margin: '20px 0', borderRadius: '12px' }}></div>
            )}

            <div ref={ref} style={{ height: '20px' }} />

            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </main>
    );
};

export default Home;
