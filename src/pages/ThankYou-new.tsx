import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ThankYou-new.css';

interface OrderDetails {
  orderNumber: string;
  customerEmail: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  estimatedDelivery: string;
}

const ThankYouNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Get order details from location state or localStorage
    const orderData = location.state?.orderDetails || localStorage.getItem('lastOrder');
    
    if (orderData) {
      if (typeof orderData === 'string') {
        setOrderDetails(JSON.parse(orderData));
      } else {
        setOrderDetails(orderData);
      }
    } else {
      // If no order data, redirect to home after countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [location.state, navigate]);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleTrackOrder = () => {
    navigate('/track-order');
  };

  const handleViewAccount = () => {
    navigate('/account');
  };

  if (!orderDetails) {
    return (
      <div className="thank-you-page">
        <div className="container">
          <div className="thank-you-content">
            <div className="success-animation">
              <div className="checkmark">✓</div>
            </div>
            <h1>No Order Found</h1>
            <p>Redirecting to home page in {countdown} seconds...</p>
            <button onClick={() => navigate('/')} className="primary-button">
              Go Home Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="thank-you-page">
      <div className="container">
        <div className="thank-you-content">
          {/* Success Animation */}
          <div className="success-animation">
            <div className="checkmark">✓</div>
            <div className="celebration-dots">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Main Message */}
          <div className="main-message">
            <h1>Thank You for Your Order!</h1>
            <p className="subtitle">
              Your order has been successfully placed and is being processed.
            </p>
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <div className="card-header">
              <h2>Order Summary</h2>
              <span className="order-number">#{orderDetails.orderNumber}</span>
            </div>
            
            <div className="order-info">
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{orderDetails.customerEmail}</span>
              </div>
              <div className="info-row">
                <span className="label">Total:</span>
                <span className="value total-amount">${orderDetails.total.toFixed(2)}</span>
              </div>
              <div className="info-row">
                <span className="label">Estimated Delivery:</span>
                <span className="value">{orderDetails.estimatedDelivery}</span>
              </div>
            </div>

            <div className="ordered-items">
              <h3>Items Ordered</h3>
              {orderDetails.items.map((item) => (
                <div key={item.id} className="item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                  <span className="item-total">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Next Section */}
          <div className="whats-next">
            <h2>What Happens Next?</h2>
            <div className="steps">
              <div className="step">
                <div className="step-icon">📧</div>
                <div className="step-content">
                  <h3>Confirmation Email</h3>
                  <p>You'll receive an email confirmation within the next few minutes.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">⚙️</div>
                <div className="step-content">
                  <h3>Order Processing</h3>
                  <p>Your order will be processed and prepared within 1-2 business days.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">🚚</div>
                <div className="step-content">
                  <h3>Shipping & Tracking</h3>
                  <p>Once shipped, you'll receive tracking information via email.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleTrackOrder} className="secondary-button">
              Track Your Order
            </button>
            <button onClick={handleContinueShopping} className="primary-button">
              Continue Shopping
            </button>
            <button onClick={handleViewAccount} className="tertiary-button">
              View Account
            </button>
          </div>

          {/* Support Section */}
          <div className="support-section">
            <h3>Need Help?</h3>
            <p>Our customer support team is here to help with any questions.</p>
            <div className="support-contacts">
              <a href="mailto:support@nfcardstore.com" className="support-link">
                📧 support@nfcardstore.com
              </a>
              <a href="tel:+15551234567" className="support-link">
                📞 +1 (555) 123-4567
              </a>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="social-sharing">
            <p>Share your new NFC cards:</p>
            <div className="social-buttons">
              <button className="social-button facebook">Share on Facebook</button>
              <button className="social-button twitter">Tweet about it</button>
              <button className="social-button linkedin">Share on LinkedIn</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouNew;