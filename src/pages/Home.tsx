import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Smartphone, Loader } from 'lucide-react';
import { Product } from '../types';
import { productUtils } from '../services/products';
import './Home.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching featured products...'); // Debug log
      
      // Try direct fetch to work around CORS
      try {
        const response = await fetch('https://anfopublicationhouse.com/api/endpoints/products.php?action=read&limit=6', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors', // Try CORS first
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Direct API Response:', data); // Debug log
        
        if (data && data.success && Array.isArray(data.data)) {
          const productsData = data.data;
          console.log('Raw Products Data:', productsData); // Debug log
          console.log('Products Data Length:', productsData.length); // Debug log
          
          if (productsData.length > 0) {
            const normalizedProducts = productsData.map((product: any, index: number) => {
              console.log(`Normalizing product ${index + 1}:`, product); // Debug log
              const normalized = productUtils.normalizeProduct(product);
              console.log(`Normalized product ${index + 1}:`, normalized); // Debug log
              return normalized;
            });
            
            console.log('All Normalized Products:', normalizedProducts); // Debug log
            
            const featuredProducts = normalizedProducts.slice(0, 6);
            console.log('Featured Products to display:', featuredProducts); // Debug log
            setProducts(featuredProducts);
          } else {
            console.warn('No products found in API response');
            setProducts([]);
          }
        } else {
          console.error('API call failed or response.success is false:', data);
          setProducts([]);
        }
      } catch (directError) {
        console.error('Direct fetch failed, trying CORS proxy:', directError);
        
        // Try CORS proxy as fallback
        try {
          const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://anfopublicationhouse.com/api/endpoints/products.php?action=read&limit=6')}`);
          const proxyData = await proxyResponse.json();
          const actualData = JSON.parse(proxyData.contents);
          
          if (actualData && actualData.success && Array.isArray(actualData.data)) {
            const productsData = actualData.data;
            const normalizedProducts = productsData.map((product: any) => productUtils.normalizeProduct(product));
            const featuredProducts = normalizedProducts.slice(0, 6);
            setProducts(featuredProducts);
            console.log('Successfully fetched via CORS proxy:', featuredProducts);
          } else {
            setProducts([]);
          }
        } catch (proxyError) {
          console.error('CORS proxy also failed:', proxyError);
          setProducts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
      console.log('Loading set to false'); // Debug log
    }
  };

  return (
    <motion.div 
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-title">
              The Future of 
              <span className="gradient-text"> Professional</span>
              <br />
              Networking
            </h1>
            <p className="hero-description">
              Revolutionize how you connect with smart NFC business cards. 
              Share your contact information instantly with a simple tap. 
              Professional, sustainable, and unforgettable.
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img 
              src="https://anfopublicationhouse.com/logo_zin_2.png" 
              alt="NFC Business Cards" 
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Digital Zin?
          </motion.h2>
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Zap className="feature-icon" />
              <h3>Instant Connection</h3>
              <p>Share your contact info with a simple tap. No apps required.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Shield className="feature-icon" />
              <h3>Secure & Reliable</h3>
              <p>Advanced NFC technology ensures your data is safe and secure.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Smartphone className="feature-icon" />
              <h3>Universal Compatibility</h3>
              <p>Works with all modern smartphones and devices.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Featured Products
          </motion.h2>
          
          {loading ? (
            <div className="loading-container">
              <Loader className="spinning" size={32} />
              <p>Loading featured products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
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
                    {product.original_price && product.original_price > product.price && (
                      <span className="discount-badge">SALE</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                  
                    <div className="product-price">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="original-price">${product.original_price.toFixed(2)}</span>
                      )}
                    </div>
                    <Link 
                      to={`/product/${product.slug || product.id}`} 
                      className="btn btn-primary btn-small"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-products-message">
              <p>No featured products available at the moment.</p>
              <p>Please check back later or browse our full catalog.</p>
              <Link to="/shop" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
          
          <motion.div 
            className="view-all"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/shop" className="btn btn-outline">
              View All Products <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Upgrade Your Networking?</h2>
            <p>Join thousands of professionals who've made the switch to NFC business cards.</p>
            <Link to="/shop" className="btn btn-primary btn-large">
              Get Started Today <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;