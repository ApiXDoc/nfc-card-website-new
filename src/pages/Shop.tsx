import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Star, Loader, Search } from 'lucide-react';
import { Product, ProductFilters, productUtils } from '../services/products';
import { categoryService, Category } from '../services/general';
import './Shop.css';

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sort: 'name',
    order: 'ASC'
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    per_page: 20,
    total_items: 0,
    has_next: false,
    has_prev: false
  });

  const sortOptions = [
    { id: 'name' as const, name: 'Name', order: 'ASC' as const },
    { id: 'price' as const, name: 'Price: Low to High', order: 'ASC' as const },
    { id: 'price' as const, name: 'Price: High to Low', order: 'DESC' as const },
    { id: 'rating' as const, name: 'Rating: High to Low', order: 'DESC' as const },
    { id: 'created_at' as const, name: 'Newest First', order: 'DESC' as const }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        // Add "All Products" option to the beginning
        const allProductsCategory: Category = {
          id: 0,
          name: 'All Products',
          slug: 'all',
          is_active: true,
          product_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Category;
        setCategories([allProductsCategory, ...response.data]);
      } else {
        // Fallback mock categories
        const mockCategories: Category[] = [
          { 
            id: 0, 
            name: 'All Products',
            slug: 'all',
            is_active: true,
            product_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Category,
          { 
            id: 1, 
            name: 'NFC Cards',
            slug: 'nfc-cards',
            is_active: true,
            product_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Category,
          { 
            id: 2, 
            name: 'Smart Cards',
            slug: 'smart-cards',
            is_active: true,
            product_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Category,
          { 
            id: 3, 
            name: 'RFID Tags',
            slug: 'rfid-tags',
            is_active: true,
            product_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Category,
          { 
            id: 4, 
            name: 'Accessories',
            slug: 'accessories',
            is_active: true,
            product_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Category
        ];
        setCategories(mockCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to mock categories on error
      const mockCategories: Category[] = [
        { 
          id: 0, 
          name: 'All Products',
          slug: 'all',
          is_active: true,
          product_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Category
      ];
      setCategories(mockCategories);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Shop: Fetching products with filters:', filters);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('action', 'read');
      
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page && filters.page > 1) params.append('page', filters.page.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.order) params.append('order', filters.order);

      const queryString = params.toString();
      const apiUrl = `https://anfopublicationhouse.com/api/endpoints/products.php?${queryString}`;
      console.log('Shop: API URL:', apiUrl);

      // Try direct fetch first
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Shop: Direct API Response:', data);
        
        if (data && data.success && Array.isArray(data.data)) {
          const productsData = data.data;
          console.log('Shop: Products data:', productsData);
          
          // Normalize products
          const normalizedProducts = productsData.map((product: any) => productUtils.normalizeProduct(product));
          console.log('Shop: Normalized products:', normalizedProducts);
          
          setProducts(normalizedProducts);
          
          // Set pagination info
          setPagination({
            current_page: filters.page || 1,
            total_pages: Math.ceil(productsData.length / (filters.limit || 20)),
            per_page: filters.limit || 20,
            total_items: productsData.length,
            has_next: false, // For now, since we're getting all products
            has_prev: (filters.page || 1) > 1
          });
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (directError) {
        console.error('Shop: Direct fetch failed, trying CORS proxy:', directError);
        
        // Try CORS proxy as fallback
        try {
          const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`);
          const proxyData = await proxyResponse.json();
          const actualData = JSON.parse(proxyData.contents);
          
          if (actualData && actualData.success && Array.isArray(actualData.data)) {
            const productsData = actualData.data;
            const normalizedProducts = productsData.map((product: any) => productUtils.normalizeProduct(product));
            
            setProducts(normalizedProducts);
            console.log('Shop: Successfully fetched via CORS proxy:', normalizedProducts);
            
            // Set pagination info
            setPagination({
              current_page: filters.page || 1,
              total_pages: Math.ceil(productsData.length / (filters.limit || 20)),
              per_page: filters.limit || 20,
              total_items: productsData.length,
              has_next: false,
              has_prev: (filters.page || 1) > 1
            });
          } else {
            throw new Error('Failed to load products');
          }
        } catch (proxyError) {
          console.error('Shop: CORS proxy also failed:', proxyError);
          setError('Failed to load products. Please try again later.');
          setProducts([]);
        }
      }
    } catch (err) {
      console.error('Shop: Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: number) => {
    setFilters((prev: ProductFilters) => ({
      ...prev,
      category: categoryId === 0 ? undefined : String(categoryId), // Don't filter by category if "All Products" is selected
      page: 1
    }));
  };

  const handleSort = (sortValue: string) => {
    const option = sortOptions.find(opt => 
      opt.name === sortValue || `${opt.id}-${opt.order}` === sortValue
    );
    
    if (option) {
      setFilters((prev: ProductFilters) => ({
        ...prev,
        sort: option.id,
        order: option.order,
        page: 1
      }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev: ProductFilters) => ({
      ...prev,
      search: searchQuery.trim() || undefined,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: ProductFilters) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: Product) => {
    navigate('/billing', {
      state: {
        product: product,
        quantity: 1
      }
    });
  };

  return (
    <motion.div 
      className="shop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="shop-header">
        <div className="container">
          <motion.h1 
            className="shop-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our NFC Card Collection
          </motion.h1>
          <motion.p 
            className="shop-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover our premium range of NFC business cards designed for modern professionals
          </motion.p>
        </div>
      </div>

      <div className="shop-content">
        <div className="container">
          {/* Search Bar */}
          <motion.div 
            className="search-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          <div className="shop-filters">
            <motion.div 
              className="filter-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="filter-group">
                <label className="filter-label">
                  <Filter size={16} />
                  Category
                </label>
                <div className="category-buttons">
                  {(categories || []).map(category => (
                    <button
                      key={category.id}
                      className={`category-btn ${filters.category === String(category.id) || (!filters.category && category.id === 0) ? 'active' : ''}`}
                      onClick={() => handleCategoryFilter(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select 
                  className="sort-select"
                  value={`${filters.sort}-${filters.order}`}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  {sortOptions.map((option, index) => (
                    <option key={index} value={`${option.id}-${option.order}`}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.div 
              className="results-count"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  Showing {products?.length || 0} of {pagination.total_items} products
                  {filters.search && ` for "${filters.search}"`}
                </span>
              )}
            </motion.div>
          </div>

          {loading ? (
            <div className="loading-container">
              <Loader className="spinning" size={48} />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={fetchProducts} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {(products || []).map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="product-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="product-image">
                      <img 
                        src={product.primary_image || product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='} 
                        alt={product.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="discount-badge">
                          {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                        </span>
                      )}
                      {!product.in_stock && (
                        <span className="stock-badge">Out of Stock</span>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.short_description || product.description}</p>
                      
                      <div className="product-rating">
                        <Star size={16} fill="currentColor" />
                        <span>{product.rating?.toFixed(1) || '0.0'}</span>
                        <span>({product.review_count || 0} reviews)</span>
                      </div>

                      <div className="product-features">
                        {product.features?.slice(0, 3).map((feature: any, idx: number) => (
                          <span key={idx} className="feature-tag">{feature.name}: {feature.value}</span>
                        ))}
                      </div>

                      <div className="product-price">
                        <span className="current-price">${product.price.toFixed(2)}</span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="original-price">${product.compare_price.toFixed(2)}</span>
                        )}
                      </div>

                      <div className="product-actions">
                        <Link 
                          to={`/product/${product.slug || product.id}`} 
                          className="btn btn-outline btn-small"
                        >
                          View Details
                        </Link>
                        {product.in_stock ? (
                          <button 
                            onClick={() => handleBuyNow(product)}
                            className="btn btn-primary btn-small"
                          >
                            Buy Now
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary btn-small disabled"
                            disabled={true}
                          >
                            Out of Stock
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <motion.div 
                  className="pagination"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <button 
                    className="btn btn-outline"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.has_prev}
                  >
                    Previous
                  </button>
                  
                  <span className="page-info">
                    Page {pagination.current_page} of {pagination.total_pages}
                  </span>
                  
                  <button 
                    className="btn btn-outline"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={!pagination.has_next}
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {(products?.length === 0 || !products) && !loading && (
                <motion.div 
                  className="no-products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms to see more results.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
