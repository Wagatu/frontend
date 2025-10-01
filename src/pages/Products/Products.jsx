import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import AnimatedSection from '../../components/Animation/AnimatedSection';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    brand: 'all',
    rating: 'all'
  });

  const categories = ['all', 'Laptops', 'Phones', 'Tablets', 'Accessories'];
  const brands = ['all', 'Apple', 'Samsung', 'Sony', 'Dell', 'HP'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-500', label: 'Under $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: '1000-2000', label: '$1000 - $2000' },
    { value: '2000+', label: 'Over $2000' }
  ];

  useEffect(() => {
    // Clear any existing cart with numeric IDs
    localStorage.removeItem('techstore_cart');
    
    // Simulate API call with UUIDs
    const mockProducts = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: "MacBook Pro 14\"",
        price: 1999,
        originalPrice: 2199,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        category: "Laptops",
        brand: "Apple",
        rating: 4.8,
        description: "Supercharged by M3 Pro or M3 Max chip for exceptional performance",
        specs: ["M3 Pro chip", "16GB RAM", "1TB SSD", "Liquid Retina XDR"],
        discount: 10
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: "iPhone 15 Pro",
        price: 999,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
        category: "Phones",
        brand: "Apple",
        rating: 4.9,
        description: "The ultimate iPhone experience with titanium design",
        specs: ["A17 Pro chip", "128GB Storage", "Titanium", "Pro camera"]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: "Samsung Galaxy S24 Ultra",
        price: 1199,
        originalPrice: 1299,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
        category: "Phones",
        brand: "Samsung",
        rating: 4.7,
        description: "Ultimate productivity and creativity in your hand",
        specs: ["Snapdragon 8 Gen 3", "256GB", "S Pen", "200MP Camera"],
        discount: 8
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: "AirPods Pro (2nd Gen)",
        price: 249,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
        category: "Accessories",
        brand: "Apple",
        rating: 4.6,
        description: "Active Noise Cancellation and Adaptive Transparency",
        specs: ["H2 chip", "ANC", "6hr battery", "MagSafe Charging"]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: "iPad Air M1",
        price: 749,
        originalPrice: 799,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        category: "Tablets",
        brand: "Apple",
        rating: 4.5,
        description: "Powerful. Colorful. Wonderful.",
        specs: ["M1 chip", "64GB Storage", "10.9\" Display", "Touch ID"],
        discount: 6
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: "Sony WH-1000XM5",
        price: 399,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        category: "Accessories",
        brand: "Sony",
        rating: 4.8,
        description: "Industry-leading noise cancellation with 30hr battery",
        specs: ["Industry ANC", "30hr battery", "Touch Control", "Quick Charge"]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: "Dell XPS 13",
        price: 1299,
        originalPrice: 1499,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
        category: "Laptops",
        brand: "Dell",
        rating: 4.4,
        description: "InfinityEdge display and powerful performance",
        specs: ["Intel i7", "16GB RAM", "512GB SSD", "13.4\" Display"],
        discount: 13
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: "Samsung Galaxy Tab S9",
        price: 899,
        image: "https://images.unsplash.com/photo-1587238450110-64f8c6d31e1a?w=400&h=300&fit=crop",
        category: "Tablets",
        brand: "Samsung",
        rating: 4.5,
        description: "Premium tablet with S Pen and stunning display",
        specs: ["Snapdragon 8 Gen 2", "256GB", "S Pen Included", "120Hz Display"]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: "HP Spectre x360",
        price: 1499,
        originalPrice: 1699,
        image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop",
        category: "Laptops",
        brand: "HP",
        rating: 4.6,
        description: "2-in-1 laptop with premium design and performance",
        specs: ["Intel i7", "16GB RAM", "1TB SSD", "13.5\" OLED"],
        discount: 12
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: "Apple Watch Series 9",
        price: 399,
        image: "https://images.unsplash.com/photo-1579586337278-3f436c25d4a1?w=400&h=300&fit=crop",
        category: "Accessories",
        brand: "Apple",
        rating: 4.7,
        description: "Smartwatch with advanced health features",
        specs: ["S9 chip", "GPS", "Always-On Display", "Health Monitoring"]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: "Samsung Galaxy Buds2 Pro",
        price: 229,
        image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?w=400&h=300&fit=crop",
        category: "Accessories",
        brand: "Samsung",
        rating: 4.4,
        description: "Premium wireless earbuds with ANC",
        specs: ["Active ANC", "360 Audio", "8hr battery", "IPX7 Waterproof"]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: "MacBook Air 15\"",
        price: 1299,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
        category: "Laptops",
        brand: "Apple",
        rating: 4.8,
        description: "Impressively big and impossibly thin",
        specs: ["M2 chip", "8GB RAM", "256GB SSD", "15.3\" Liquid Retina"]
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filters, searchTerm, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Brand filter
    if (filters.brand !== 'all') {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        switch (filters.priceRange) {
          case '0-500': return product.price <= 500;
          case '500-1000': return product.price > 500 && product.price <= 1000;
          case '1000-2000': return product.price > 1000 && product.price <= 2000;
          case '2000+': return product.price > 2000;
          default: return true;
        }
      });
    }

    // Rating filter
    if (filters.rating !== 'all') {
      filtered = filtered.filter(product => product.rating >= parseFloat(filters.rating));
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      brand: 'all',
      rating: 'all'
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="products-page loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <AnimatedSection>
          <div className="page-header">
            <h1>Our Products</h1>
            <p>Discover the latest tech gadgets and accessories</p>
          </div>
        </AnimatedSection>

        {/* Search and Controls */}
        <div className="products-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
            <button 
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="filters-sidebar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="filter-section">
                <h3>Categories</h3>
                {categories.map(category => (
                  <label key={category} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    <span>{category === 'all' ? 'All Categories' : category}</span>
                  </label>
                ))}
              </div>

              <div className="filter-section">
                <h3>Brand</h3>
                {brands.map(brand => (
                  <label key={brand} className="filter-option">
                    <input
                      type="radio"
                      name="brand"
                      value={brand}
                      checked={filters.brand === brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                    />
                    <span>{brand === 'all' ? 'All Brands' : brand}</span>
                  </label>
                ))}
              </div>

              <div className="filter-section">
                <h3>Price Range</h3>
                {priceRanges.map(range => (
                  <label key={range.value} className="filter-option">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>

              <div className="filter-section">
                <h3>Rating</h3>
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <label key={rating} className="filter-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating.toString()}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                    />
                    <span>{rating}+ Stars</span>
                  </label>
                ))}
                <label className="filter-option">
                  <input
                    type="radio"
                    name="rating"
                    value="all"
                    checked={filters.rating === 'all'}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                  />
                  <span>All Ratings</span>
                </label>
              </div>

              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid/List */}
        <div className={`products-content ${showFilters ? 'with-filters' : ''}`}>
          <div className="products-info">
            <p>Showing {filteredProducts.length} of {products.length} products</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`products-display ${viewMode}`}>
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;