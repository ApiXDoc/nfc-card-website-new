import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, Phone, ArrowRight, Package, Truck } from 'lucide-react';
import './ThankYou.css';

const ThankYou: React.FC = () => {
  const location = useLocation();
  const [orderData, setOrderData] = useState<{
    orderNumber: string; 
    total: number;
    productName: string;
    quantity: number;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    paymentMode: string;
    orderDate: string;
  } | null>(null);

  useEffect(() => {
    // Get order data from navigation state
    const state = location.state as { 
      orderNumber?: string; 
      total?: number;
      productName?: string;
      quantity?: number;
      customerInfo?: {
        name: string;
        email: string;
        phone: string;
        address: string;
      };
      paymentMode?: string;
      orderDate?: string;
    } | null;
    
    if (state?.orderNumber) {
      setOrderData({
        orderNumber: state.orderNumber,
        total: state.total || 0,
        productName: state.productName || 'NFC Business Card',
        quantity: state.quantity || 1,
        customerInfo: state.customerInfo || {
          name: 'Customer',
          email: 'customer@example.com',
          phone: 'N/A',
          address: 'N/A'
        },
        paymentMode: state.paymentMode || 'cod',
        orderDate: state.orderDate || new Date().toISOString()
      });
    }
  }, [location]);

  // Order details with actual data from the order or mock data as fallback
  const orderDetails = {
    orderNumber: orderData?.orderNumber || 'NFC' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: orderData?.orderDate ? new Date(orderData.orderDate).toLocaleDateString() : new Date().toLocaleDateString(),
    email: orderData?.customerInfo?.email || 'customer@example.com',
    customerName: orderData?.customerInfo?.name || 'Valued Customer',
    phone: orderData?.customerInfo?.phone || 'N/A',
    total: orderData?.total || 65.97,
    paymentMode: orderData?.paymentMode || 'cod',
    items: [
      {
        name: orderData?.productName || 'NFC Business Card',
        quantity: orderData?.quantity || 1,
        price: orderData?.total ? (orderData.total / 1.08) : 29.99 // Reverse calculate price before tax
      }
    ],
    shipping: {
      method: 'Standard Shipping',
      address: orderData?.customerInfo?.address || '123 Main Street, New York, NY 10001',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  };

  const nextSteps = [
    {
      icon: <Mail size={24} />,
      title: 'Confirmation Email',
      description: `You'll receive a confirmation email at ${orderDetails.email} with your order details within minutes.`,
      status: 'completed'
    },
    {
      icon: <Package size={24} />,
      title: 'Order Processing',
      description: 'We\'ll prepare your NFC cards with care and quality assurance.',
      status: 'in-progress'
    },
    {
      icon: <Truck size={24} />,
      title: 'Shipping & Delivery',
      description: `Your order will be shipped and delivered by ${orderDetails.shipping.estimatedDelivery}.`,
      status: 'pending'
    }
  ];

  return (
    <motion.div 
      className="thank-you"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        {/* Success Header */}
        <motion.div 
          className="success-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <CheckCircle size={80} />
          </motion.div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase, {orderDetails.customerName}! Your order has been successfully placed.</p>
          <div className="order-number">
            Order #{orderDetails.orderNumber}
          </div>
        </motion.div>

        {/* Order Details */}
        <div className="content-grid">
          <motion.div 
            className="order-summary-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2>Order Summary</h2>
            <div className="order-info">
              <div className="info-row">
                <span>Order Date:</span>
                <span>{orderDetails.date}</span>
              </div>
              <div className="info-row">
                <span>Customer Name:</span>
                <span>{orderDetails.customerName}</span>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <span>{orderDetails.email}</span>
              </div>
              <div className="info-row">
                <span>Phone:</span>
                <span>{orderDetails.phone}</span>
              </div>
              <div className="info-row">
                <span>Payment Mode:</span>
                <span className="payment-mode">{orderDetails.paymentMode === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div className="info-row">
                <span>Total Amount:</span>
                <span className="total-amount">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="order-items">
              <h3>Items Ordered</h3>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="shipping-info">
              <h3>Shipping Information</h3>
              <p><strong>Method:</strong> {orderDetails.shipping.method}</p>
              <p><strong>Address:</strong> {orderDetails.shipping.address}</p>
              <p><strong>Estimated Delivery:</strong> {orderDetails.shipping.estimatedDelivery}</p>
            </div>

            <button className="download-receipt-btn">
              <Download size={16} />
              Download Receipt
            </button>
          </motion.div>

          <motion.div 
            className="next-steps-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>What Happens Next?</h2>
            <div className="steps-timeline">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`step ${step.status}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                  {step.status === 'completed' && (
                    <CheckCircle size={20} className="status-icon completed" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Support & Actions */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="support-cards">
            <div className="support-card">
              <h3>Need Help?</h3>
              <p>Our customer support team is here to assist you with any questions.</p>
              <div className="support-contacts">
                <a href="mailto:support@digitalzin.com" className="contact-link">
                  <Mail size={16} />
                  support@digitalzin.com
                </a>
                <a href="tel:+15551234567" className="contact-link">
                  <Phone size={16} />
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            <div className="support-card">
              <h3>Track Your Order</h3>
              <p>We'll send you tracking information once your order ships.</p>
              <Link to="/contact" className="btn btn-outline">
                Contact Support
              </Link>
            </div>

            <div className="support-card">
              <h3>Share Your Experience</h3>
              <p>We'd love to hear about your experience with our NFC cards!</p>
              <div className="social-links">
                <span>Follow us on social media</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="action-buttons"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping <ArrowRight size={20} />
          </Link>
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="additional-info"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="info-grid">
            <div className="info-item">
              <h4>🎯 Customization Tips</h4>
              <p>Learn how to set up your NFC card and customize your digital profile for maximum impact.</p>
            </div>
            <div className="info-item">
              <h4>🔧 Technical Support</h4>
              <p>Need help with NFC compatibility or setup? Our technical team is ready to assist you.</p>
            </div>
            <div className="info-item">
              <h4>🚀 Best Practices</h4>
              <p>Discover tips and tricks to get the most out of your new NFC business cards.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ThankYou;
