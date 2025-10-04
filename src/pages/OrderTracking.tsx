import React, { useState, useEffect } from 'react';
import './OrderTracking.css';

interface OrderStatus {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customerEmail: string;
  total: number;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  statusHistory: Array<{
    status: string;
    message: string;
    timestamp: string;
  }>;
}

const OrderTracking: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data - replace with actual API response
      const mockOrder: OrderStatus = {
        id: '1',
        orderNumber: orderNumber,
        status: 'shipped',
        customerEmail: email,
        total: 29.99,
        trackingNumber: '1Z999AA1234567890',
        carrier: 'UPS',
        estimatedDelivery: '2025-09-15',
        items: [
          {
            id: '1',
            name: 'Premium Black NFC Business Card',
            quantity: 1,
            price: 29.99
          }
        ],
        statusHistory: [
          {
            status: 'Order Placed',
            message: 'Your order has been received and payment confirmed',
            timestamp: '2025-09-10T10:00:00Z'
          },
          {
            status: 'Processing',
            message: 'Your order is being prepared for shipment',
            timestamp: '2025-09-10T14:30:00Z'
          },
          {
            status: 'Shipped',
            message: 'Your order has been shipped via UPS',
            timestamp: '2025-09-11T09:15:00Z'
          }
        ]
      };

      setOrderData(mockOrder);
    } catch (err) {
      setError('Order not found. Please check your order number and email address.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'order placed':
        return '📋';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '📦';
      default:
        return '📍';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'processing':
        return 50;
      case 'shipped':
        return 75;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="order-tracking">
      <div className="container">
        <h1>Track Your Order</h1>

        {!orderData ? (
          <form onSubmit={handleTrackOrder} className="tracking-form">
            <div className="form-group">
              <label htmlFor="orderNumber">Order Number</label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="track-button">
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        ) : (
          <div className="order-details">
            <div className="order-header">
              <h2>Order #{orderData.orderNumber}</h2>
              <button 
                onClick={() => setOrderData(null)} 
                className="track-another-button"
              >
                Track Another Order
              </button>
            </div>

            <div className="status-overview">
              <div className="status-badge">
                <span className="status-icon">{getStatusIcon(orderData.status)}</span>
                <span className="status-text">{orderData.status.toUpperCase()}</span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getStatusProgress(orderData.status)}%` }}
                ></div>
              </div>
            </div>

            {orderData.trackingNumber && (
              <div className="tracking-info">
                <h3>Tracking Information</h3>
                <div className="tracking-details">
                  <div className="tracking-row">
                    <span className="label">Tracking Number:</span>
                    <span className="value">{orderData.trackingNumber}</span>
                  </div>
                  <div className="tracking-row">
                    <span className="label">Carrier:</span>
                    <span className="value">{orderData.carrier}</span>
                  </div>
                  {orderData.estimatedDelivery && (
                    <div className="tracking-row">
                      <span className="label">Estimated Delivery:</span>
                      <span className="value">
                        {new Date(orderData.estimatedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="order-timeline">
              <h3>Order Timeline</h3>
              <div className="timeline">
                {orderData.statusHistory.map((status, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon">
                      {getStatusIcon(status.status)}
                    </div>
                    <div className="timeline-content">
                      <h4>{status.status}</h4>
                      <p>{status.message}</p>
                      <span className="timestamp">
                        {new Date(status.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-items">
              <h3>Items in this Order</h3>
              {orderData.items.map((item) => (
                <div key={item.id} className="order-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-total">
                <strong>Total: ${orderData.total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="help-section">
              <h3>Need Help?</h3>
              <p>If you have questions about your order, please contact our customer support:</p>
              <div className="contact-options">
                <a href="mailto:support@nfcardstore.com" className="contact-link">
                  📧 support@nfcardstore.com
                </a>
                <a href="tel:+15551234567" className="contact-link">
                  📞 +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;