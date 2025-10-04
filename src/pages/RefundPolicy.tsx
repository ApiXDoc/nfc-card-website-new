import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import './RefundPolicy.css';

const RefundPolicy: React.FC = () => {
  return (
    <motion.div 
      className="refund-policy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="refund-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="header-icon">
              <RefreshCw size={40} />
            </div>
            <h1>Refund Policy</h1>
            <p>We want you to be completely satisfied with your Digital Zin purchase. Review our refund and return policy below.</p>
            <div className="last-updated">Last Updated: September 19, 2025</div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <motion.div 
            className="refund-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            
            <div className="policy-overview">
              <h2>Quick Overview</h2>
              <div className="overview-grid">
                <div className="overview-item">
                  <div className="overview-icon">
                    <Clock size={24} />
                  </div>
                  <div className="overview-content">
                    <h4>30-Day Return Window</h4>
                    <p>Request returns within 30 days of delivery</p>
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="overview-content">
                    <h4>Full Refund Available</h4>
                    <p>Get 100% refund on eligible returns</p>
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-icon">
                    <CheckCircle size={24} />
                  </div>
                  <div className="overview-content">
                    <h4>Easy Process</h4>
                    <p>Simple online return request system</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="refund-section">
              <h2>1. Return Eligibility</h2>
              <div className="subsection">
                <h3>1.1 Eligible Items</h3>
                <div className="eligible-items">
                  <div className="item-status eligible">
                    <CheckCircle size={20} />
                    <div>
                      <h4>Standard NFC Cards</h4>
                      <p>Unused cards in original packaging within 30 days</p>
                    </div>
                  </div>
                  <div className="item-status eligible">
                    <CheckCircle size={20} />
                    <div>
                      <h4>Defective Products</h4>
                      <p>Products with manufacturing defects or technical issues</p>
                    </div>
                  </div>
                  <div className="item-status eligible">
                    <CheckCircle size={20} />
                    <div>
                      <h4>Wrong Items Received</h4>
                      <p>If you received incorrect products due to our error</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h3>1.2 Non-Eligible Items</h3>
                <div className="non-eligible-items">
                  <div className="item-status not-eligible">
                    <XCircle size={20} />
                    <div>
                      <h4>Customized NFC Cards</h4>
                      <p>Cards with personal information, logos, or custom designs</p>
                    </div>
                  </div>
                  <div className="item-status not-eligible">
                    <XCircle size={20} />
                    <div>
                      <h4>Used or Programmed Cards</h4>
                      <p>Cards that have been programmed or activated</p>
                    </div>
                  </div>
                  <div className="item-status not-eligible">
                    <XCircle size={20} />
                    <div>
                      <h4>Damaged Packaging</h4>
                      <p>Items with damaged or missing original packaging</p>
                    </div>
                  </div>
                  <div className="item-status not-eligible">
                    <XCircle size={20} />
                    <div>
                      <h4>After 30 Days</h4>
                      <p>Return requests made after 30 days from delivery date</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="refund-section">
              <h2>2. Return Process</h2>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Contact Us</h4>
                    <p>Email us at returns@digitalzin.com or call +1 (555) 123-4567 with your order number and reason for return.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Return Authorization</h4>
                    <p>We'll provide you with a Return Merchandise Authorization (RMA) number and return instructions.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Package & Ship</h4>
                    <p>Pack the item securely in original packaging and ship to our return address using the provided label.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Inspection & Refund</h4>
                    <p>Once we receive and inspect your return, we'll process your refund within 5-7 business days.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="refund-section">
              <h2>3. Refund Timeline</h2>
              <div className="timeline-grid">
                <div className="timeline-item">
                  <h4>Return Received</h4>
                  <div className="timeline-duration">Day 1</div>
                  <p>We confirm receipt of your returned item</p>
                </div>
                <div className="timeline-item">
                  <h4>Quality Inspection</h4>
                  <div className="timeline-duration">Days 1-3</div>
                  <p>We inspect the item to ensure it meets return criteria</p>
                </div>
                <div className="timeline-item">
                  <h4>Refund Processing</h4>
                  <div className="timeline-duration">Days 3-5</div>
                  <p>We process the refund to your original payment method</p>
                </div>
                <div className="timeline-item">
                  <h4>Refund Received</h4>
                  <div className="timeline-duration">Days 5-10</div>
                  <p>You receive the refund (timing depends on your bank/card issuer)</p>
                </div>
              </div>
            </section>

            <section className="refund-section">
              <h2>4. Refund Methods</h2>
              <div className="refund-methods">
                <div className="method-item">
                  <h4>Original Payment Method</h4>
                  <p>Refunds will be processed to the original payment method used for the purchase (credit card, debit card, etc.)</p>
                </div>
                <div className="method-item">
                  <h4>Cash on Delivery (COD) Orders</h4>
                  <p>For COD orders, refunds will be issued via bank transfer or check. You'll need to provide banking details.</p>
                </div>
                <div className="method-item">
                  <h4>Store Credit Option</h4>
                  <p>You may choose to receive store credit instead of a refund, which can be used for future purchases.</p>
                </div>
              </div>
            </section>

            <section className="refund-section">
              <h2>5. Exchanges</h2>
              <p>
                We currently do not offer direct exchanges. If you need a different product, please return the original 
                item for a refund and place a new order for the desired product.
              </p>
              <div className="exchange-note">
                <strong>Note:</strong> For defective items, we may offer a direct replacement of the same product 
                to expedite the process.
              </div>
            </section>

            <section className="refund-section">
              <h2>6. Shipping Costs</h2>
              <div className="shipping-grid">
                <div className="shipping-scenario">
                  <h4>Our Error</h4>
                  <p>If the return is due to our error (wrong item, defective product), we'll cover all shipping costs.</p>
                </div>
                <div className="shipping-scenario">
                  <h4>Customer Preference</h4>
                  <p>If returning due to change of mind, customer is responsible for return shipping costs.</p>
                </div>
                <div className="shipping-scenario">
                  <h4>Original Shipping</h4>
                  <p>Original shipping costs are non-refundable unless the return is due to our error.</p>
                </div>
              </div>
            </section>

            <section className="refund-section">
              <h2>7. International Returns</h2>
              <p>
                International customers are responsible for return shipping costs and any customs duties or taxes. 
                We recommend using a trackable shipping method for international returns.
              </p>
              <div className="international-note">
                <strong>Important:</strong> Customs forms should be marked as "Returned Goods" to avoid additional charges.
              </div>
            </section>

            <section className="refund-section">
              <h2>8. Damaged or Lost Returns</h2>
              <p>
                Digital Zin is not responsible for returns that are damaged or lost in transit. We strongly recommend:
              </p>
              <ul>
                <li>Using a trackable shipping method</li>
                <li>Purchasing shipping insurance for valuable items</li>
                <li>Keeping proof of shipment until refund is processed</li>
                <li>Packaging items securely to prevent damage</li>
              </ul>
            </section>

            <section className="refund-section">
              <h2>9. Refund Exceptions</h2>
              <div className="subsection">
                <h3>9.1 Promotional Items</h3>
                <p>
                  Items purchased with promotional discounts or during special sales may have different return terms. 
                  Check the specific promotion terms for details.
                </p>
              </div>

              <div className="subsection">
                <h3>9.2 Bulk Orders</h3>
                <p>
                  Orders of 50+ units may have special return terms. Contact our sales team for bulk order return policies.
                </p>
              </div>

              <div className="subsection">
                <h3>9.3 Digital Services</h3>
                <p>
                  Digital profile setup and programming services are non-refundable once completed.
                </p>
              </div>
            </section>

            <section className="refund-section">
              <h2>10. Contact Information</h2>
              <p>
                For return requests or questions about our refund policy, please contact us:
              </p>
              <div className="contact-info">
                <p><strong>Digital Zin Returns Department</strong></p>
                <p>Email: returns@digitalzin.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Hours: Monday-Friday, 9 AM - 6 PM EST</p>
                <p>Address: 123 Business Street, Suite 100, Your City, State 12345</p>
              </div>
            </section>

            <div className="satisfaction-guarantee">
              <div className="guarantee-icon">
                <CheckCircle size={32} />
              </div>
              <div className="guarantee-content">
                <h3>Our Satisfaction Guarantee</h3>
                <p>
                  At Digital Zin, customer satisfaction is our top priority. We stand behind the quality of our products 
                  and are committed to making things right if you're not completely satisfied with your purchase.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default RefundPolicy;