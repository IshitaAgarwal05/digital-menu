import React, { useEffect, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import SkeletonCard from '../components/SkeletonCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { FilterContext } from '../context/FilterContext';
import NoItemsFound from '../components/NoItemsFound';
import FlavorFilter from '../components/FlavorFilter';

const INITIAL_LIMIT = 25;
const LOAD_MORE_LIMIT = 20;

const Home = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { currentCategory, currentBrand, searchTerm, sortBy, flavorFilter, resetFilters } = useContext(FilterContext);

    const fetchProducts = useCallback(async (pageNum, isNewFilter = false) => {
        if (loading) return;
        setLoading(true);
        try {
            // First load uses INITIAL_LIMIT, subsequent "Load More" uses LOAD_MORE_LIMIT
            const limit = pageNum === 1 ? INITIAL_LIMIT : LOAD_MORE_LIMIT;
            // For pages > 1, we need to account for the different first page size
            // Calculate the correct skip manually
            const skip = pageNum === 1 ? 0 : INITIAL_LIMIT + (pageNum - 2) * LOAD_MORE_LIMIT;

            const { data } = await api.get('/products', {
                params: {
                    page: pageNum,
                    limit,
                    skip,
                    category: currentCategory,
                    brand: currentBrand,
                    search: searchTerm,
                    sortBy,
                    flavor: flavorFilter
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
                setHasMore(data.products.length === limit);
                setTotalItems(data.total);
            }
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    }, [currentCategory, currentBrand, searchTerm, sortBy, flavorFilter]);

    // Reset and fetch when filters change
    useEffect(() => {
        setPage(1);
        fetchProducts(1, true);
    }, [currentCategory, currentBrand, searchTerm, sortBy, flavorFilter, fetchProducts]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage);
    };

    const handleSurpriseMe = () => {
        if (products.length > 0) {
            const randomIdx = Math.floor(Math.random() * products.length);
            setSelectedProduct(products[randomIdx]);
        }
    };

    return (
        <main className="content-area">
            <div className="sticky-filters-wrapper">
                <div className="controls-bar">
                    <SearchBar />
                    <div className="controls-right">
                        <button
                            className="surprise-btn"
                            onClick={handleSurpriseMe}
                            title="Surprise Me!"
                        >
                            🎲
                        </button>
                        <SortDropdown />
                    </div>
                </div>

                <FlavorFilter />
            </div>

            <div className="section-header">
                <h2>{currentBrand !== 'All Brands' ? `${currentBrand} ` : ''}{searchTerm ? 'Search Results' : currentCategory}</h2>
                <span className="section-count">{totalItems} items</span>
            </div>

            {loading && products.length === 0 ? (
                <div className="menu-grid">
                    {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : products.length === 0 ? (
                <NoItemsFound onClear={resetFilters} />
            ) : (
                <ProductGrid products={products} onProductClick={(p) => setSelectedProduct(p)} />
            )}

            {/* Load More button */}
            {hasMore && !loading && products.length > 0 && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={handleLoadMore}>
                        Load More 🍨
                    </button>
                </div>
            )}

            {loading && products.length > 0 && (
                <div className="load-more-container">
                    <div className="load-more-btn loading-pulse">Loading...</div>
                </div>
            )}

            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </main>
    );
};

export default Home;
