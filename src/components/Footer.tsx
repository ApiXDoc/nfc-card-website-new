import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-logo">
              <Zap className="logo-icon" />
              <span>Digital Zin</span>
            </div>
            <p className="footer-description">
              Premium NFC cards for modern professionals. Connect instantly, 
              share seamlessly, and make lasting impressions with Digital Zin.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
              <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
            </div>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/contact">FAQ</Link></li>
            </ul>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3>Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>info@digitalzin.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>123 Business Street, Suite 100, Your City, State 12345</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Digital Zin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
