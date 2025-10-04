import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, ArrowLeft, Plus, Minus, Check, Shield, Truck, RefreshCw,
  MessageCircle, HeadphonesIcon, ChevronDown, ChevronUp, User, ThumbsUp, ThumbsDown,
  ChevronLeft, ChevronRight, ZoomIn, X
} from 'lucide-react';
import { Product } from '../types';
import { productUtils } from '../services/products';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'faq'>('description');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (id) {
      console.log('ProductDetail: URL parameter id =', id);
      fetchProduct(id);
    } else {
      console.log('ProductDetail: No ID provided in URL');
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

  const handlePrevImage = () => {
    setSelectedImage(prev => {
      if (!product) return prev;
      const images = product.images && product.images.length > 0 
        ? product.images.map(img => img.image_url).filter(Boolean)
        : [product.primary_image || product.image].filter(Boolean);
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  const handleNextImage = () => {
    setSelectedImage(prev => {
      if (!product) return prev;
      const images = product.images && product.images.length > 0 
        ? product.images.map(img => img.image_url).filter(Boolean)
        : [product.primary_image || product.image].filter(Boolean);
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    if (!product) return;
    
    const images = product.images && product.images.length > 0 
      ? product.images.map(img => img.image_url).filter(Boolean)
      : [product.primary_image || product.image].filter(Boolean);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextImage();
      } else if (e.key === 'Escape' && showImageModal) {
        setShowImageModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, selectedImage, showImageModal]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching product with ID:', productId);
      
      // Try direct fetch to get all products and filter by ID
      try {
        const response = await fetch('https://anfopublicationhouse.com/api/endpoints/products.php?action=read', {
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
        console.log('Direct API Response for all products:', data);
        
        if (data && data.success && Array.isArray(data.data)) {
          console.log('Available products:', data.data.map((p: any) => ({ id: p.id, slug: p.slug, name: p.product_name || p.name })));
          
          // Find the specific product by ID, slug, or SKU
          const foundProduct = data.data.find((p: any) => {
            const pId = p.id?.toString();
            const pSlug = p.slug;
            const pSku = p.sku;
            const pName = (p.product_name || p.name || '').toLowerCase().replace(/\s+/g, '-');
            
            console.log(`Checking product: id=${pId}, slug=${pSlug}, sku=${pSku}, generated_slug=${pName}`);
            
            return pId === productId ||
                   pSlug === productId ||
                   pSku === productId ||
                   pName === productId;
          });
          
          console.log('Found product:', foundProduct);
          
          if (foundProduct) {
            const normalizedProduct = productUtils.normalizeProduct(foundProduct);
            console.log('Found and normalized product:', normalizedProduct);
            setProduct(normalizedProduct);
            
            // Set related products (exclude current product)
            const relatedFiltered = data.data
              .filter((p: any) => p.id.toString() !== foundProduct.id.toString())
              .slice(0, 4)
              .map(productUtils.normalizeProduct);
            setRelatedProducts(relatedFiltered);
          } else {
            console.log('Product not found in API response. Looking for:', productId);
            console.log('Available product IDs:', data.data.map((p: any) => p.id));
            setError('Product not found');
          }
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (directError) {
        console.error('Direct fetch failed, trying CORS proxy:', directError);
        
        // Try CORS proxy as fallback
        try {
          const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://anfopublicationhouse.com/api/endpoints/products.php?action=read')}`);
          const proxyData = await proxyResponse.json();
          const actualData = JSON.parse(proxyData.contents);
          
          if (actualData && actualData.success && Array.isArray(actualData.data)) {
            // Find the specific product by ID, slug, or SKU
            const foundProduct = actualData.data.find((p: any) => {
              const pId = p.id?.toString();
              const pSlug = p.slug;
              const pSku = p.sku;
              const pName = (p.product_name || p.name || '').toLowerCase().replace(/\s+/g, '-');
              
              return pId === productId ||
                     pSlug === productId ||
                     pSku === productId ||
                     pName === productId;
            });
            
            if (foundProduct) {
              const normalizedProduct = productUtils.normalizeProduct(foundProduct);
              setProduct(normalizedProduct);
              console.log('Successfully fetched product via CORS proxy:', normalizedProduct);
              
              // Set related products
              const relatedFiltered = actualData.data
                .filter((p: any) => p.id.toString() !== foundProduct.id.toString())
                .slice(0, 4)
                .map(productUtils.normalizeProduct);
              setRelatedProducts(relatedFiltered);
            } else {
              setError('Product not found');
            }
          } else {
            throw new Error('Product not found');
          }
        } catch (proxyError) {
          console.error('CORS proxy also failed:', proxyError);
          setError('Failed to load product details');
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

    const handleBuyNow = () => {
    if (!product) return;
    
    // Pass product data and quantity to billing page
    navigate('/billing', {
      state: {
        product: product,
        quantity: quantity
      }
    });
  };

  // FAQ Data
  const faqData = [
    {
      question: "How do NFC business cards work?",
      answer: "NFC business cards use Near Field Communication technology. Simply tap your card on any NFC-enabled smartphone, and your contact information will instantly appear. No app download required!"
    },
    {
      question: "Are these cards compatible with all phones?",
      answer: "Yes! Our NFC cards work with all modern smartphones (iPhone and Android) that have NFC capability, which includes virtually all phones made after 2014."
    },
    {
      question: "Can I update my information after purchase?",
      answer: "Absolutely! You can update your contact information, social media links, and other details anytime through our online portal. Changes reflect immediately."
    },
    {
      question: "How durable are these cards?",
      answer: "Our cards are made from premium materials and are waterproof, scratch-resistant, and designed to last for years with regular use."
    },
    {
      question: "What information can I include?",
      answer: "You can include contact details, social media links, website, portfolio, calendar booking links, payment information, and much more!"
    }
  ];

  // Sample Reviews Data
  const reviewsData = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-03-15",
      comment: "Amazing quality! The NFC technology works flawlessly and the design is sleek and professional. Highly recommended!",
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 5,
      date: "2024-03-10",
      comment: "Game changer for networking events. People are always impressed when I tap my card on their phone. Great investment!",
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      date: "2024-03-05",
      comment: "Love the concept and execution. Setup was easy and the card feels premium. Only wish it came in more color options.",
      verified: true,
      helpful: 5
    }
  ];

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading-container">
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={40} />
            </motion.div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="error-container">
            <h2>Product Not Found</h2>
            <p>{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/shop" className="btn btn-primary">
              <ArrowLeft size={20} />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.image_url).filter(Boolean)
    : [product.primary_image || product.image].filter(Boolean);

  const imageAlts = product.images && product.images.length > 0 
    ? product.images.map(img => img.alt_text || `${product.name} - Image`)
    : [`${product.name} - Main Image`];

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <motion.nav 
          className="breadcrumb"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
        
        </motion.div>

        {/* Product Details */}
        <div className="product-content">
          {/* Product Images */}
          <motion.div 
            className="product-images"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="main-image">
              <img 
                src={images[selectedImage] || product.primary_image || product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='} 
                alt={imageAlts[selectedImage] || product.name}
                onError={handleImageError}
                onClick={() => setShowImageModal(true)}
                style={{ cursor: 'zoom-in' }}
              />
              
              {/* Zoom Icon */}
              <button 
                className="zoom-button"
                onClick={() => setShowImageModal(true)}
                title="Zoom image"
              >
                <ZoomIn size={20} />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    className="nav-button nav-prev"
                    onClick={handlePrevImage}
                    title="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    className="nav-button nav-next"
                    onClick={handleNextImage}
                    title="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {product.original_price && product.original_price > product.price && (
                <span className="discount-badge">
                  SAVE {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="image-counter">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    title={imageAlts[index] || `View image ${index + 1}`}
                  >
                    <img 
                      src={image} 
                      alt={imageAlts[index] || `${product.name} view ${index + 1}`}
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="product-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
           
            </div>

            {/* Rating */}
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(product.rating) ? 'filled' : ''}
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.rating} ({product.total_reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="product-price">
              <span className="current-price">
                {productUtils.formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="original-price">
                  {productUtils.formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <p>{product.short_description || product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Status */}
            <div className={`stock-status ${product.is_in_stock ? 'in-stock' : 'out-of-stock'}`}>
              {product.is_in_stock ? (
                <>
                  <Check size={16} />
                  In Stock ({product.stock_quantity} available)
                </>
              ) : (
                <>
                  Out of Stock
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {product.is_in_stock && (
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Buy Now */}
            <div className="product-actions">
              <motion.button 
                className="btn btn-primary buy-now-btn"
                onClick={handleBuyNow}
                disabled={!product.is_in_stock}
                whileTap={{ scale: 0.95 }}
              >
                Buy Now - {productUtils.formatPrice(product.price * quantity)}
              </motion.button>
            </div>

            {/* Product Info Cards */}
            <div className="info-cards">
              <div className="info-card">
                <Shield size={24} />
                <div>
                  <h4>Secure Payment</h4>
                  <p>Your payment information is safe with us</p>
                </div>
              </div>
              <div className="info-card">
                <Truck size={24} />
                <div>
                  <h4>Free Shipping</h4>
                  <p>Free shipping on orders over $50</p>
                </div>
              </div>
              <div className="info-card">
                <RefreshCw size={24} />
                <div>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.section 
          className="product-details-tabs"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviewsData.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <motion.div 
                className="tab-panel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>Product Description</h3>
                <p>{product?.description}</p>
                
                {product?.features && product.features.length > 0 && (
                  <div className="features-section">
                    <h4>Key Features</h4>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>
                          <Check size={16} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="specifications">
                  <h4>Specifications</h4>
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span className="spec-label">SKU:</span>
                      <span className="spec-value">{product?.sku}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Category:</span>
                      <span className="spec-value">{product?.category_name}</span>
                    </div>
                    {product?.weight && (
                      <div className="spec-item">
                        <span className="spec-label">Weight:</span>
                        <span className="spec-value">{product.weight}</span>
                      </div>
                    )}
                    {product?.dimensions && (
                      <div className="spec-item">
                        <span className="spec-label">Dimensions:</span>
                        <span className="spec-value">{product.dimensions}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                className="tab-panel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="reviews-section">
                  <div className="reviews-header">
                    <h3>Customer Reviews</h3>
                    <div className="review-summary">
                      <div className="average-rating">
                        <span className="rating-number">{product?.rating}</span>
                        <div className="stars-large">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={20} 
                              className={i < Math.floor(product?.rating || 0) ? 'filled' : ''}
                            />
                          ))}
                        </div>
                        <span className="total-reviews">({product?.total_reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {reviewsData.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              <User size={20} />
                            </div>
                            <div>
                              <h4>{review.name}</h4>
                              <div className="review-meta">
                                <div className="stars">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={14} 
                                      className={i < review.rating ? 'filled' : ''}
                                    />
                                  ))}
                                </div>
                                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                                {review.verified && <span className="verified-badge">Verified Purchase</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <div className="review-actions">
                          <button className="helpful-btn">
                            <ThumbsUp size={14} />
                            Helpful ({review.helpful})
                          </button>
                          <button className="report-btn">
                            <ThumbsDown size={14} />
                            Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="write-review">
                    <h4>Write a Review</h4>
                    <p>Share your experience with this product</p>
                    <button className="btn btn-outline">Write Review</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'faq' && (
              <motion.div 
                className="tab-panel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="faq-section">
                  <h3>Frequently Asked Questions</h3>
                  <div className="faq-list">
                    {faqData.map((faq, index) => (
                      <div key={index} className="faq-item">
                        <button 
                          className="faq-question"
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                          <span>{faq.question}</span>
                          {expandedFaq === index ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <motion.div 
                            className="faq-answer"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p>{faq.answer}</p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="faq-contact">
                    <h4>Still have questions?</h4>
                    <p>Our support team is here to help you</p>
                    <div className="contact-options">
                      <button className="btn btn-outline" onClick={() => setShowChatWidget(true)}>
                        <MessageCircle size={16} />
                        Live Chat
                      </button>
                      <a href="mailto:support@nfccards.com" className="btn btn-outline">
                        <HeadphonesIcon size={16} />
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Chat Widget */}
        {showChatWidget && (
          <motion.div 
            className="chat-widget-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowChatWidget(false)}
          >
            <motion.div 
              className="chat-widget"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="chat-header">
                <h3>Live Chat Support</h3>
                <button onClick={() => setShowChatWidget(false)}>×</button>
              </div>
              <div className="chat-content">
                <div className="chat-message bot">
                  <div className="message-avatar">
                    <HeadphonesIcon size={16} />
                  </div>
                  <div className="message-content">
                    <p>Hi! How can I help you with this product today?</p>
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button className="btn btn-primary">Send</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section 
            className="related-products"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>You May Also Like</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="product-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="product-image">
                    <img 
                      src={relatedProduct.primary_image || relatedProduct.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='} 
                      alt={relatedProduct.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                    {relatedProduct.original_price && relatedProduct.original_price > relatedProduct.price && (
                      <span className="discount-badge">SALE</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{relatedProduct.name}</h3>
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < Math.floor(relatedProduct.rating) ? 'filled' : ''}
                          />
                        ))}
                      </div>
                      <span>({relatedProduct.total_reviews})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">
                        {productUtils.formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.original_price && relatedProduct.original_price > relatedProduct.price && (
                        <span className="original-price">
                          {productUtils.formatPrice(relatedProduct.original_price)}
                        </span>
                      )}
                    </div>
                    <Link 
                      to={`/product/${relatedProduct.id}`} 
                      className="btn btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Floating Support Button */}
        <motion.button 
          className="floating-support-btn"
          onClick={() => setShowChatWidget(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <MessageCircle size={24} />
          <span>Need Help?</span>
        </motion.button>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div 
          className="image-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowImageModal(false)}
        >
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowImageModal(false)}
              title="Close"
            >
              <X size={24} />
            </button>
            
            <img 
              src={images[selectedImage]} 
              alt={imageAlts[selectedImage] || product.name}
              onError={handleImageError}
            />
            
            {images.length > 1 && (
              <>
                <button 
                  className="modal-nav modal-prev"
                  onClick={handlePrevImage}
                  title="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  className="modal-nav modal-next"
                  onClick={handleNextImage}
                  title="Next image"
                >
                  <ChevronRight size={32} />
                </button>
                
                <div className="modal-counter">
                  {selectedImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetail;
