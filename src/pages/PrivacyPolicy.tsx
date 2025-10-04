import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div 
      className="privacy-policy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="header-icon">
              <Shield size={40} />
            </div>
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. This policy explains how Digital Zin collects, uses, and protects your information.</p>
            <div className="last-updated">Last Updated: September 19, 2025</div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <motion.div 
            className="privacy-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <section className="privacy-section">
              <h2>1. Information We Collect</h2>
              <div className="subsection">
                <h3>1.1 Personal Information</h3>
                <p>We collect personal information that you voluntarily provide to us when you:</p>
                <ul>
                  <li>Create an account or make a purchase</li>
                  <li>Contact us for customer support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>This information may include:</p>
                <ul>
                  <li>Name and contact information (email, phone, address)</li>
                  <li>Payment information (processed securely by third-party payment processors)</li>
                  <li>Profile information for your NFC cards</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              
              <div className="subsection">
                <h3>1.2 Automatically Collected Information</h3>
                <p>When you visit our website, we automatically collect certain information, including:</p>
                <ul>
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Referring website</li>
                  <li>Pages viewed and time spent on our site</li>
                  <li>Date and time of visits</li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <div className="purpose-grid">
                <div className="purpose-item">
                  <div className="purpose-icon">
                    <Database size={24} />
                  </div>
                  <div className="purpose-content">
                    <h4>Service Provision</h4>
                    <p>To process orders, create your NFC cards, and deliver our services</p>
                  </div>
                </div>
                <div className="purpose-item">
                  <div className="purpose-icon">
                    <Lock size={24} />
                  </div>
                  <div className="purpose-content">
                    <h4>Account Management</h4>
                    <p>To create and manage your account and authenticate your identity</p>
                  </div>
                </div>
                <div className="purpose-item">
                  <div className="purpose-icon">
                    <Eye size={24} />
                  </div>
                  <div className="purpose-content">
                    <h4>Communication</h4>
                    <p>To send order updates, customer support, and marketing communications</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="privacy-section">
              <h2>3. Information Sharing and Disclosure</h2>
              <div className="subsection">
                <h3>3.1 Third-Party Service Providers</h3>
                <p>We may share your information with trusted third-party service providers who assist us in:</p>
                <ul>
                  <li>Payment processing</li>
                  <li>Order fulfillment and shipping</li>
                  <li>Customer support</li>
                  <li>Website analytics</li>
                  <li>Email marketing services</li>
                </ul>
                <p>These providers are contractually obligated to protect your information and use it only for the specified purposes.</p>
              </div>

              <div className="subsection">
                <h3>3.2 Legal Requirements</h3>
                <p>We may disclose your information if required to do so by law or in response to:</p>
                <ul>
                  <li>Court orders or legal process</li>
                  <li>Government or regulatory requests</li>
                  <li>Protection of our rights and property</li>
                  <li>Prevention of fraud or security threats</li>
                </ul>
              </div>

              <div className="subsection">
                <h3>3.3 Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                  as part of the business assets. We will notify you of such changes via email or website notice.
                </p>
              </div>
            </section>

            <section className="privacy-section">
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and data storage</li>
                <li>Access controls and authentication</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="privacy-section">
              <h2>5. Data Retention</h2>
              <p>
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, 
                comply with legal obligations, resolve disputes, and enforce our agreements. Specific retention periods include:
              </p>
              <ul>
                <li><strong>Account Information:</strong> Until account deletion or 3 years after last activity</li>
                <li><strong>Order History:</strong> 7 years for tax and legal compliance</li>
                <li><strong>Marketing Data:</strong> Until you unsubscribe or 2 years of inactivity</li>
                <li><strong>Website Analytics:</strong> 26 months from collection</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>6. Your Privacy Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              
              <div className="rights-grid">
                <div className="right-item">
                  <h4>Access</h4>
                  <p>Request a copy of the personal information we hold about you</p>
                </div>
                <div className="right-item">
                  <h4>Correction</h4>
                  <p>Request correction of inaccurate or incomplete information</p>
                </div>
                <div className="right-item">
                  <h4>Deletion</h4>
                  <p>Request deletion of your personal information</p>
                </div>
                <div className="right-item">
                  <h4>Portability</h4>
                  <p>Request transfer of your data to another service provider</p>
                </div>
                <div className="right-item">
                  <h4>Objection</h4>
                  <p>Object to processing for marketing or legitimate interests</p>
                </div>
                <div className="right-item">
                  <h4>Restriction</h4>
                  <p>Request limitation of processing in certain circumstances</p>
                </div>
              </div>

              <p>
                To exercise these rights, please contact us using the information provided at the end of this policy. 
                We will respond to your request within 30 days.
              </p>
            </section>

            <section className="privacy-section">
              <h2>7. Cookies and Tracking Technologies</h2>
              <div className="subsection">
                <h3>7.1 Types of Cookies</h3>
                <p>We use the following types of cookies and similar technologies:</p>
                <ul>
                  <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </div>

              <div className="subsection">
                <h3>7.2 Cookie Management</h3>
                <p>
                  You can control cookies through your browser settings. Note that disabling certain cookies 
                  may affect the functionality of our website.
                </p>
              </div>
            </section>

            <section className="privacy-section">
              <h2>8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices 
                or content of these external sites. We encourage you to review the privacy policies of any third-party 
                sites you visit.
              </p>
            </section>

            <section className="privacy-section">
              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected personal information from 
                a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section className="privacy-section">
              <h2>10. International Data Transfers</h2>
              <p>
                Your information may be processed and stored in countries other than your own. We ensure that appropriate 
                safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.
              </p>
            </section>

            <section className="privacy-section">
              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of material changes by posting the updated policy on our website and updating the 
                "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="privacy-section">
              <h2>12. Contact Information</h2>
              <p>
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="contact-info">
                <p><strong>Digital Zin Privacy Team</strong></p>
                <p>Email: privacy@digitalzin.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Business Street, Suite 100, Your City, State 12345</p>
              </div>
            </section>

            <div className="privacy-commitment">
              <div className="commitment-icon">
                <Shield size={32} />
              </div>
              <div className="commitment-content">
                <h3>Our Privacy Commitment</h3>
                <p>
                  At Digital Zin, we are committed to protecting your privacy and being transparent about our data practices. 
                  We believe that you should have control over your personal information and we strive to earn and maintain your trust.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default PrivacyPolicy;