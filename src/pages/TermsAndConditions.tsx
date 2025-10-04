import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, AlertCircle } from 'lucide-react';
import './TermsAndConditions.css';

const TermsAndConditions: React.FC = () => {
  return (
    <motion.div 
      className="terms-and-conditions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="header-icon">
              <FileText size={40} />
            </div>
            <h1>Terms and Conditions</h1>
            <p>Please read these terms and conditions carefully before using Digital Zin services.</p>
            <div className="last-updated">Last Updated: September 19, 2025</div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <motion.div 
            className="terms-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <section className="term-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Digital Zin's website and services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="term-section">
              <h2>2. Description of Service</h2>
              <p>
                Digital Zin provides NFC (Near Field Communication) business cards and related digital networking solutions. 
                Our services include custom NFC card design, digital profile creation, and contactless sharing capabilities.
              </p>
            </section>

            <section className="term-section">
              <h2>3. User Accounts and Registration</h2>
              <div className="subsection">
                <h3>3.1 Account Creation</h3>
                <p>
                  To use certain features of our service, you may be required to create an account. You agree to provide accurate, 
                  current, and complete information during the registration process.
                </p>
              </div>
              <div className="subsection">
                <h3>3.2 Account Security</h3>
                <p>
                  You are responsible for safeguarding the password and all activities that occur under your account. 
                  You agree to immediately notify Digital Zin of any unauthorized use of your account.
                </p>
              </div>
            </section>

            <section className="term-section">
              <h2>4. Product Orders and Payment</h2>
              <div className="subsection">
                <h3>4.1 Order Placement</h3>
                <p>
                  All orders are subject to acceptance by Digital Zin. We reserve the right to refuse or cancel any order 
                  for any reason at any time.
                </p>
              </div>
              <div className="subsection">
                <h3>4.2 Pricing</h3>
                <p>
                  All prices are listed in USD and are subject to change without notice. The price charged will be the 
                  price in effect at the time the order is placed.
                </p>
              </div>
              <div className="subsection">
                <h3>4.3 Payment Methods</h3>
                <p>
                  We accept various payment methods including Cash on Delivery (COD) and online payments. 
                  Payment must be made in full before product delivery.
                </p>
              </div>
            </section>

            <section className="term-section">
              <h2>5. Shipping and Delivery</h2>
              <p>
                Digital Zin will make reasonable efforts to deliver products within the estimated timeframe. 
                However, delivery times are estimates and not guarantees. We are not liable for delays caused by 
                circumstances beyond our control.
              </p>
            </section>

            <section className="term-section">
              <h2>6. Intellectual Property Rights</h2>
              <div className="subsection">
                <h3>6.1 Digital Zin Content</h3>
                <p>
                  All content on this website, including text, graphics, logos, images, and software, is the property of 
                  Digital Zin and is protected by copyright and other intellectual property laws.
                </p>
              </div>
              <div className="subsection">
                <h3>6.2 User Content</h3>
                <p>
                  You retain ownership of any content you provide to us for use in your NFC cards. However, 
                  you grant Digital Zin a license to use such content for the purpose of providing our services.
                </p>
              </div>
            </section>

            <section className="term-section">
              <h2>7. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                to understand our practices regarding the collection and use of your personal information.
              </p>
            </section>

            <section className="term-section">
              <h2>8. Prohibited Uses</h2>
              <p>You may not use our service:</p>
              <ul>
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="term-section">
              <h2>9. Disclaimers and Limitation of Liability</h2>
              <div className="subsection">
                <h3>9.1 Disclaimer</h3>
                <p>
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
                  Digital Zin excludes all representations, warranties, conditions, or other terms.
                </p>
              </div>
              <div className="subsection">
                <h3>9.2 Limitation of Liability</h3>
                <p>
                  Digital Zin shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages 
                  resulting from your use of or inability to use the service.
                </p>
              </div>
            </section>

            <section className="term-section">
              <h2>10. Refunds and Returns</h2>
              <p>
                Please refer to our Refund Policy for detailed information about returns, exchanges, and refunds.
              </p>
            </section>

            <section className="term-section">
              <h2>11. Modifications to Terms</h2>
              <p>
                Digital Zin reserves the right to modify these terms at any time. We will notify users of any material changes 
                by posting the new terms on this page. Your continued use of the service after such modifications constitutes 
                acceptance of the new terms.
              </p>
            </section>

            <section className="term-section">
              <h2>12. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever including limitation for breach of these terms.
              </p>
            </section>

            <section className="term-section">
              <h2>13. Governing Law</h2>
              <p>
                These terms shall be interpreted and governed by the laws of the United States. Any disputes relating to these terms 
                shall be subject to the exclusive jurisdiction of the courts in the United States.
              </p>
            </section>

            <section className="term-section">
              <h2>14. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="contact-info">
                <p><strong>Digital Zin</strong></p>
                <p>Email: support@digitalzin.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Business Street, Suite 100, Your City, State 12345</p>
              </div>
            </section>

            <div className="important-notice">
              <div className="notice-icon">
                <AlertCircle size={24} />
              </div>
              <div className="notice-content">
                <h3>Important Notice</h3>
                <p>
                  These terms and conditions constitute the entire agreement between you and Digital Zin and govern your use of the service, 
                  superseding any prior agreements between you and Digital Zin.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TermsAndConditions;