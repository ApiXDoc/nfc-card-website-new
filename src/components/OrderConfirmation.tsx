import React from 'react';
import './OrderConfirmation.css';

interface OrderConfirmationProps {
  orderNumber: string;
  customerEmail: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  customerEmail,
  total,
  items
}) => {
  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been received and is being processed.</p>
      </div>

      <div className="order-details">
        <div className="order-info">
          <h2>Order Information</h2>
          <div className="info-row">
            <span className="label">Order Number:</span>
            <span className="value">{orderNumber}</span>
          </div>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{customerEmail}</span>
          </div>
          <div className="info-row">
            <span className="label">Total:</span>
            <span className="value">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-items">
          <h2>Items Ordered</h2>
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">Qty: {item.quantity}</span>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="next-steps">
        <h2>What's Next?</h2>
        <ul>
          <li>You will receive an email confirmation shortly</li>
          <li>Your order will be processed within 1-2 business days</li>
          <li>You'll receive tracking information once your order ships</li>
          <li>Contact us if you have any questions</li>
        </ul>
      </div>
    </div>
  );
};

export default OrderConfirmation;