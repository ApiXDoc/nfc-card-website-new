import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import './Billing.css';

interface CreateOrderRequest {
  name: string;
  email: string;
  phone: string;
  shipping_address: string;
  total_amount: number;
  order_data: string;
  order_status: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  order_id?: string;
  orderNumber?: string;
}

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Get product data from navigation state
    const state = location.state as { product?: Product; quantity?: number } | null;
    if (state?.product) {
      setProduct(state.product);
      setQuantity(state.quantity || 1);
    } else {
      // Redirect back to shop if no product data
      navigate('/shop');
    }
  }, [location, navigate]);
  
  const [billingData, setBillingData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Billing Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Mode
    paymentMode: 'cod'
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    if (!billingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!billingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!billingData.email.trim()) newErrors.email = 'Email is required';
    if (!billingData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!billingData.address.trim()) newErrors.address = 'Address is required';
    if (!billingData.city.trim()) newErrors.city = 'City is required';
    if (!billingData.state.trim()) newErrors.state = 'State is required';
    if (!billingData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Email format validation
    if (billingData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone format validation (basic)
    if (billingData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(billingData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 handleSubmit called - Form submitted!');
    
    if (!product) {
      console.error('No product data available');
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    setIsProcessing(true);
    console.log('⏳ Processing started, isProcessing set to true');
    
    try {
      // Calculate order totals
      const subtotal = product.price * quantity;
      const tax = subtotal * 0.08; // 8% tax
      const totalAmount = subtotal + tax;

      // Prepare order data for API
      const orderData: CreateOrderRequest = {
        name: `${billingData.firstName} ${billingData.lastName}`,
        email: billingData.email,
        phone: billingData.phone,
        shipping_address: `${billingData.address}, ${billingData.city}, ${billingData.state} ${billingData.zipCode}, ${billingData.country}`,
        total_amount: parseFloat(totalAmount.toFixed(2)),
        order_data: `Product: ${product.name}, Quantity: ${quantity}, Payment: ${billingData.paymentMode}`,
        order_status: "pending"
      };

      // Call the order creation API
      console.log('📡 Making API call to: https://anfopublicationhouse.com/api/endpoints/orders.php?action=create');
      console.log('📦 Order data:', orderData);
      
      const apiResponse = await fetch('https://anfopublicationhouse.com/api/endpoints/orders.php?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      console.log('📤 API Response status:', apiResponse.status);
      
      let response: ApiResponse;
      try {
        response = await apiResponse.json();
        console.log('✅ API call successful:', response);
      } catch (parseError) {
        console.error('❌ Failed to parse API response:', parseError);
        throw new Error('Invalid response from server');
      }
      
      if (apiResponse.ok && response.success) {
        // Generate order number from API response or create one
        const orderNumber = response.order_id || response.orderNumber || 'NFC' + new Date().getFullYear() + Math.random().toString().substring(2, 8);
        
        console.log('✅ Order created successfully! Order number:', orderNumber);
        console.log('🚀 Navigating to /thank-you page...');

        // Navigate to ThankYou page with complete order and user details
        navigate('/thank-you', {
          state: {
            orderNumber: orderNumber,
            total: totalAmount,
            productName: product.name,
            quantity: quantity,
            customerInfo: {
              name: `${billingData.firstName} ${billingData.lastName}`,
              email: billingData.email,
              phone: billingData.phone,
              address: `${billingData.address}, ${billingData.city}, ${billingData.state} ${billingData.zipCode}, ${billingData.country}`
            },
            paymentMode: billingData.paymentMode,
            orderDate: new Date().toISOString()
          }
        });
      } else {
        console.error('❌ API returned unsuccessful response:', response);
        throw new Error(response?.message || 'Failed to create order');
      }
      
    } catch (error: any) {
      console.error('❌ Order processing failed:', error);
      alert(`Failed to process order: ${error.message || 'Please try again.'}`);
    } finally {
      console.log('🔄 Setting isProcessing to false');
      setIsProcessing(false);
    }
  };

  // Return early if no product data
  if (!product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product information...</p>
      </div>
    );
  }

  // Calculate order totals based on actual product
  const subtotal = product.price * quantity;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <motion.div 
      className="billing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div 
          className="billing-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link to="/shop" className="back-link">
            <ArrowLeft size={20} />
            Back to Shop
          </Link>
          <h1>Checkout</h1>
          <div className="secure-badge">
            <Lock size={16} />
            Secure Checkout
          </div>
        </motion.div>

        <div className="billing-content">
          <motion.div 
            className="billing-form-section"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="billing-form" noValidate>
              {/* Customer Information */}
              <div className="form-section">
                <h2>Customer Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={billingData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="John"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={billingData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Doe"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={billingData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={billingData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="form-section">
                <h2>Billing Address</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={billingData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main Street"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={billingData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="New York"
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={billingData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="NY"
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={billingData.zipCode}
                      onChange={handleInputChange}
                      required
                      placeholder="10001"
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={billingData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="form-section">
                <h2>
                  <CreditCard size={20} />
                  Payment Mode
                </h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cod"
                      checked={billingData.paymentMode === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <div className="option-name">Cash on Delivery (COD)</div>
                      <div className="option-description">Pay when you receive your order</div>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="online"
                      checked={billingData.paymentMode === 'online'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <div className="option-name">Online Payment</div>
                      <div className="option-description">Pay securely online with card or digital wallet</div>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Complete Order - ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div 
            className="order-summary"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2>Order Summary</h2>
            
            <div className="order-items">
              <div className="order-item">
                <img src={product.primary_image || product.image || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop'} alt={product.name} />
                <div className="item-details">
                  <h4>{product.name}</h4>
                  <div className="item-quantity">Qty: {quantity}</div>
                </div>
                <div className="item-price">
                  ${(product.price * quantity).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-info">
              <div className="security-item">
                <Lock size={16} />
                <span>SSL Encrypted</span>
              </div>
              <div className="security-item">
                <CreditCard size={16} />
                <span>Secure Payment</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Billing;