-- NFC Card Store Database Schema
-- Created: September 2025
-- Supports: Dynamic products, orders, shipping, FAQ, contact us, and more

-- Drop existing tables if they exist (for development purposes)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS shipping_info;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS faq;
DROP TABLE IF EXISTS shipping_methods;
DROP TABLE IF EXISTS order_tracking;
DROP TABLE IF EXISTS admin_users;

-- Categories table for product organization
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table for dynamic product management
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    sku VARCHAR(100) UNIQUE,
    category_id INT,
    stock_quantity INT DEFAULT 0,
    is_in_stock BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    weight DECIMAL(8, 2),
    dimensions VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_active (is_active),
    INDEX idx_featured (featured),
    INDEX idx_stock (is_in_stock)
);

-- Product features table for flexible feature management
CREATE TABLE product_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id VARCHAR(36),
    feature_text VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
);

-- Product images table for multiple images per product
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id VARCHAR(36),
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_primary (is_primary)
);

-- Customers table for user management
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Customer addresses table for multiple addresses
CREATE TABLE customer_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(36),
    type ENUM('billing', 'shipping', 'both') DEFAULT 'both',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(100),
    street_address VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_default (is_default)
);

-- Shipping methods table
CREATE TABLE shipping_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    estimated_days_min INT,
    estimated_days_max INT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table for order management
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id VARCHAR(36),
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_transaction_id VARCHAR(255),
    shipping_method_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_order_number (order_number)
);

-- Order items table for order line items
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36),
    product_id VARCHAR(36),
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- Order shipping info table
CREATE TABLE order_shipping_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    street_address VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    tracking_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Order billing info table
CREATE TABLE order_billing_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    street_address VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Order tracking/status history table
CREATE TABLE order_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL,
    message TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_status (status)
);

-- Product reviews table
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id VARCHAR(36),
    customer_id VARCHAR(36),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_customer (customer_id),
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved)
);

-- FAQ table for frequently asked questions
CREATE TABLE faq (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
);

-- Contact messages table for contact us form
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('general', 'support', 'sales', 'complaint', 'other') DEFAULT 'general',
    status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to VARCHAR(100),
    response TEXT,
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at)
);

-- Newsletter subscriptions table
CREATE TABLE newsletter_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    confirmed BOOLEAN DEFAULT FALSE,
    confirmation_token VARCHAR(255),
    confirmed_at TIMESTAMP NULL,
    unsubscribed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Coupons/Discount codes table
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('percentage', 'fixed_amount', 'free_shipping') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    minimum_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    usage_limit INT,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active),
    INDEX idx_valid_period (valid_from, valid_until)
);

-- Coupon usage tracking
CREATE TABLE coupon_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coupon_id INT,
    order_id VARCHAR(36),
    customer_id VARCHAR(36),
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_coupon (coupon_id),
    INDEX idx_order (order_id),
    INDEX idx_customer (customer_id)
);

-- Admin users table for backend management
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('super_admin', 'admin', 'manager', 'support') DEFAULT 'support',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Website settings table for dynamic configuration
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_public (is_public)
);

-- Insert initial categories
INSERT INTO categories (name, description, slug, sort_order) VALUES
('Business Cards', 'Professional NFC business cards for networking', 'business', 1),
('Personal Cards', 'Personal NFC cards for social sharing', 'personal', 2),
('Premium Collection', 'Luxury and premium NFC cards', 'premium', 3);

-- Insert initial shipping methods
INSERT INTO shipping_methods (name, description, price, estimated_days_min, estimated_days_max, sort_order) VALUES
('Standard Shipping', 'Regular delivery within 5-7 business days', 5.99, 5, 7, 1),
('Express Shipping', 'Fast delivery within 2-3 business days', 12.99, 2, 3, 2),
('Overnight Shipping', 'Next business day delivery', 24.99, 1, 1, 3),
('Free Shipping', 'Free standard shipping for orders over $50', 0.00, 7, 10, 4);

-- Insert sample FAQ entries
INSERT INTO faq (category, question, answer, sort_order) VALUES
('General', 'What are NFC business cards?', 'NFC (Near Field Communication) business cards are smart cards that can instantly share your contact information, social media profiles, and other digital content when tapped against an NFC-enabled smartphone.', 1),
('General', 'How do NFC cards work?', 'Simply hold your NFC card near any smartphone with NFC enabled (most modern smartphones have this). The phone will automatically receive your programmed information without needing any special apps.', 2),
('Ordering', 'How long does shipping take?', 'Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping delivers the next business day. Free shipping is available for orders over $50.', 1),
('Ordering', 'Can I customize my NFC card?', 'Yes! Our premium cards come with custom design services. You can add your logo, choose colors, and personalize the content that gets shared when someone taps your card.', 2),
('Technical', 'Do NFC cards work with all phones?', 'NFC cards work with all smartphones that have NFC capability, which includes most modern Android phones and iPhones (iPhone 7 and newer). No special apps are required.', 1),
('Technical', 'Can I update the information on my NFC card?', 'Yes, depending on the type of NFC card you purchase. Our premium cards come with updateable links that allow you to change your contact information and social media links anytime.', 2);

-- Insert sample site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'NFC Card Store', 'string', 'Website name', TRUE),
('site_description', 'Premium NFC business cards and smart cards for modern professionals', 'string', 'Site description for SEO', TRUE),
('contact_email', 'support@nfcardstore.com', 'string', 'Main contact email', TRUE),
('contact_phone', '+1 (555) 123-4567', 'string', 'Main contact phone', TRUE),
('free_shipping_threshold', '50.00', 'number', 'Minimum order for free shipping', TRUE),
('tax_rate', '8.25', 'number', 'Default tax rate percentage', FALSE),
('currency', 'USD', 'string', 'Default currency', TRUE),
('order_number_prefix', 'NFC', 'string', 'Prefix for order numbers', FALSE);

-- Create a trigger to automatically update product ratings when reviews are added
DELIMITER //
CREATE TRIGGER update_product_rating_after_review 
AFTER INSERT ON product_reviews 
FOR EACH ROW 
BEGIN
    UPDATE products 
    SET rating = (
        SELECT AVG(rating) 
        FROM product_reviews 
        WHERE product_id = NEW.product_id AND is_approved = TRUE
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM product_reviews 
        WHERE product_id = NEW.product_id AND is_approved = TRUE
    )
    WHERE id = NEW.product_id;
END//
DELIMITER ;

-- Create a trigger to update order totals when items are added
DELIMITER //
CREATE TRIGGER update_order_total_after_item_insert 
AFTER INSERT ON order_items 
FOR EACH ROW 
BEGIN
    UPDATE orders 
    SET subtotal = (
        SELECT SUM(total_price) 
        FROM order_items 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
    
    UPDATE orders 
    SET total_amount = subtotal + shipping_cost + tax_amount - discount_amount
    WHERE id = NEW.order_id;
END//
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_featured_active ON products(featured, is_active);
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_reviews_product_approved ON product_reviews(product_id, is_approved);

-- Create a view for active products with category information
CREATE VIEW active_products_view AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE AND c.is_active = TRUE;

-- Create a view for order summary information
CREATE VIEW order_summary_view AS
SELECT 
    o.*,
    osi.tracking_number,
    osi.carrier,
    COUNT(oi.id) as item_count,
    SUM(oi.quantity) as total_quantity
FROM orders o
LEFT JOIN order_shipping_info osi ON o.id = osi.order_id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- Sample data for testing and initial setup
-- Insert sample products based on your existing data structure

-- Insert sample products
INSERT INTO products (id, name, slug, description, short_description, price, original_price, sku, category_id, stock_quantity, is_in_stock, rating, total_reviews, featured) VALUES
('1', 'Premium Black NFC Business Card', 'premium-black-nfc-business-card', 
 'Sleek black NFC business card with instant contact sharing capability. Made from premium materials with a sophisticated matte finish. Perfect for professionals who want to make a lasting impression while staying connected in the digital age.',
 'Sleek black NFC business card with instant contact sharing capability.',
 29.99, 39.99, 'NBC-PREM-001', 1, 150, TRUE, 4.8, 124, TRUE),

('2', 'Gold Elite NFC Card', 'gold-elite-nfc-card',
 'Luxury gold-plated NFC card for executives and professionals. Includes custom design service and premium packaging. This exclusive card represents the pinnacle of professional networking technology.',
 'Luxury gold-plated NFC card for executives and professionals.',
 49.99, 59.99, 'NBC-GOLD-002', 3, 75, TRUE, 4.9, 89, TRUE),

('3', 'Personal Style NFC Card', 'personal-style-nfc-card',
 'Perfect for personal use with customizable designs and colors. Great for sharing social profiles and contact info. Express your personality while staying connected with friends and family.',
 'Perfect for personal use with customizable designs and colors.',
 19.99, NULL, 'NBC-PERS-003', 2, 200, TRUE, 4.6, 156, FALSE),

('4', 'Executive Titanium Card', 'executive-titanium-card',
 'Ultra-premium titanium NFC card with laser engraving. The ultimate status symbol for C-level executives and entrepreneurs. Lifetime warranty included.',
 'Ultra-premium titanium NFC card with laser engraving.',
 99.99, 129.99, 'NBC-TITAN-004', 3, 25, TRUE, 5.0, 32, TRUE),

('5', 'Eco-Friendly Bamboo Card', 'eco-friendly-bamboo-card',
 'Sustainable bamboo NFC card for environmentally conscious professionals. Made from certified sustainable bamboo with advanced NFC technology.',
 'Sustainable bamboo NFC card for environmentally conscious professionals.',
 34.99, NULL, 'NBC-ECO-005', 1, 100, TRUE, 4.7, 67, FALSE),

('6', 'Student Starter Pack', 'student-starter-pack',
 'Affordable NFC card perfect for students and young professionals. Includes basic customization and social media integration. Great for networking events and internships.',
 'Affordable NFC card perfect for students and young professionals.',
 14.99, 19.99, 'NBC-STUD-006', 2, 300, TRUE, 4.4, 203, FALSE);

-- Insert product features
INSERT INTO product_features (product_id, feature_text, sort_order) VALUES
('1', 'Instant contact sharing', 1),
('1', 'Social media linking', 2),
('1', 'Professional matte finish', 3),
('1', 'Scratch resistant', 4),
('1', 'Compatible with all smartphones', 5),

('2', 'Gold-plated finish', 1),
('2', 'Custom design service', 2),
('2', 'Premium gift box', 3),
('2', 'Lifetime warranty', 4),
('2', 'Advanced NFC chip', 5),

('3', 'Multiple color options', 1),
('3', 'Social media integration', 2),
('3', 'Affordable pricing', 3),
('3', 'Quick setup', 4),
('3', 'Modern design', 5),

('4', 'Titanium construction', 1),
('4', 'Laser engraving', 2),
('4', 'Executive gift box', 3),
('4', 'Lifetime warranty', 4),
('4', 'Concierge setup service', 5),

('5', 'Sustainable bamboo material', 1),
('5', 'Eco-friendly packaging', 2),
('5', 'Carbon neutral shipping', 3),
('5', 'Natural wood grain', 4),
('5', 'Biodegradable', 5),

('6', 'Student discount eligible', 1),
('6', 'Basic customization', 2),
('6', 'Social media focus', 3),
('6', 'Quick delivery', 4),
('6', 'Easy setup guide', 5);

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
('1', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop', 'Premium Black NFC Business Card', TRUE, 1),
('1', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop', 'Black card side view', FALSE, 2),

('2', 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop', 'Gold Elite NFC Card', TRUE, 1),
('2', 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop', 'Gold card in premium box', FALSE, 2),

('3', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', 'Personal Style NFC Card', TRUE, 1),
('4', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', 'Executive Titanium Card', TRUE, 1),
('5', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop', 'Eco-Friendly Bamboo Card', TRUE, 1),
('6', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', 'Student Starter Pack', TRUE, 1);

-- Insert sample customer
INSERT INTO customers (id, first_name, last_name, email, phone, is_active, email_verified) VALUES
('cust-001', 'John', 'Doe', 'john.doe@example.com', '+1-555-0123', TRUE, TRUE),
('cust-002', 'Jane', 'Smith', 'jane.smith@example.com', '+1-555-0124', TRUE, TRUE),
('cust-003', 'Mike', 'Johnson', 'mike.johnson@example.com', '+1-555-0125', TRUE, FALSE);

-- Insert sample customer addresses
INSERT INTO customer_addresses (customer_id, type, first_name, last_name, street_address, city, state, postal_code, country, is_default) VALUES
('cust-001', 'both', 'John', 'Doe', '123 Main Street', 'New York', 'NY', '10001', 'United States', TRUE),
('cust-002', 'both', 'Jane', 'Smith', '456 Oak Avenue', 'Los Angeles', 'CA', '90210', 'United States', TRUE);

-- Insert sample orders
INSERT INTO orders (id, order_number, customer_id, customer_email, status, subtotal, shipping_cost, tax_amount, total_amount, payment_status, payment_method, shipping_method_id) VALUES
('order-001', 'NFC2025001', 'cust-001', 'john.doe@example.com', 'delivered', 29.99, 5.99, 2.88, 38.86, 'paid', 'credit_card', 1),
('order-002', 'NFC2025002', 'cust-002', 'jane.smith@example.com', 'shipped', 49.99, 12.99, 5.04, 68.02, 'paid', 'paypal', 2),
('order-003', 'NFC2025003', 'cust-001', 'john.doe@example.com', 'processing', 19.99, 0.00, 1.60, 21.59, 'paid', 'credit_card', 4);

-- Insert order items
INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price) VALUES
('order-001', '1', 'Premium Black NFC Business Card', 'NBC-PREM-001', 1, 29.99, 29.99),
('order-002', '2', 'Gold Elite NFC Card', 'NBC-GOLD-002', 1, 49.99, 49.99),
('order-003', '3', 'Personal Style NFC Card', 'NBC-PERS-003', 1, 19.99, 19.99);

-- Insert shipping information
INSERT INTO order_shipping_info (order_id, first_name, last_name, street_address, city, state, postal_code, country, tracking_number, carrier) VALUES
('order-001', 'John', 'Doe', '123 Main Street', 'New York', 'NY', '10001', 'United States', '1Z999AA1234567890', 'UPS'),
('order-002', 'Jane', 'Smith', '456 Oak Avenue', 'Los Angeles', 'CA', '90210', 'United States', 'EZ1234567890US', 'USPS'),
('order-003', 'John', 'Doe', '123 Main Street', 'New York', 'NY', '10001', 'United States', NULL, NULL);

-- Insert order tracking history
INSERT INTO order_tracking (order_id, status, message, created_by) VALUES
('order-001', 'pending', 'Order received and payment confirmed', 'system'),
('order-001', 'processing', 'Order is being prepared for shipment', 'admin'),
('order-001', 'shipped', 'Order shipped via UPS - Tracking: 1Z999AA1234567890', 'system'),
('order-001', 'delivered', 'Order delivered successfully', 'system'),

('order-002', 'pending', 'Order received and payment confirmed', 'system'),
('order-002', 'processing', 'Order is being prepared for shipment', 'admin'),
('order-002', 'shipped', 'Order shipped via USPS - Tracking: EZ1234567890US', 'system'),

('order-003', 'pending', 'Order received and payment confirmed', 'system'),
('order-003', 'processing', 'Order is being prepared for shipment', 'admin');

-- Insert sample product reviews
INSERT INTO product_reviews (product_id, customer_id, customer_name, customer_email, rating, title, review_text, is_verified, is_approved) VALUES
('1', 'cust-001', 'John Doe', 'john.doe@example.com', 5, 'Excellent quality!', 'The premium black card exceeded my expectations. The matte finish looks professional and the NFC works perfectly.', TRUE, TRUE),
('1', 'cust-002', 'Jane Smith', 'jane.smith@example.com', 4, 'Great for networking', 'Used this at a conference and it was a hit. Everyone was impressed with the technology.', TRUE, TRUE),
('2', 'cust-001', 'John Doe', 'john.doe@example.com', 5, 'Luxury at its best', 'The gold finish is stunning and the custom design service was exceptional. Worth every penny.', TRUE, TRUE),
('3', 'cust-002', 'Jane Smith', 'jane.smith@example.com', 4, 'Perfect for personal use', 'Great value for money. Easy to set up and works great for sharing social media.', TRUE, TRUE);

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, phone, subject, message, type, status) VALUES
('Sarah Wilson', 'sarah.wilson@email.com', '+1-555-0126', 'Bulk Order Inquiry', 'Hi, I am interested in ordering 50 NFC cards for our company. Can you provide a bulk discount?', 'sales', 'new'),
('David Brown', 'david.brown@email.com', '+1-555-0127', 'Card Not Working', 'I received my NFC card yesterday but it does not seem to work with my iPhone. Can you help?', 'support', 'new'),
('Lisa Garcia', 'lisa.garcia@email.com', NULL, 'Custom Design Question', 'Do you offer custom logo design services? I would like to include my company logo on the card.', 'general', 'new');

-- Insert sample coupons
INSERT INTO coupons (code, name, description, type, value, minimum_order_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off your first order', 'percentage', 10.00, 0.00, 100, DATE_ADD(NOW(), INTERVAL 30 DAY)),
('FREESHIP', 'Free Shipping', 'Free shipping on any order', 'free_shipping', 0.00, 25.00, 50, DATE_ADD(NOW(), INTERVAL 60 DAY)),
('STUDENT20', 'Student Discount', '20% off for students', 'percentage', 20.00, 0.00, 200, DATE_ADD(NOW(), INTERVAL 90 DAY)),
('BULK5OFF', 'Bulk Order Discount', '$5 off orders over $100', 'fixed_amount', 5.00, 100.00, NULL, DATE_ADD(NOW(), INTERVAL 180 DAY));

-- Insert admin users
INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role) VALUES
('admin', 'admin@nfcardstore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'super_admin'),
('support', 'support@nfcardstore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Support', 'Team', 'support'),
('manager', 'manager@nfcardstore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Store', 'Manager', 'manager');

-- Insert newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, name, is_active, confirmed) VALUES
('john.doe@example.com', 'John Doe', TRUE, TRUE),
('jane.smith@example.com', 'Jane Smith', TRUE, TRUE),
('newsletter@example.com', 'Newsletter Subscriber', TRUE, FALSE);

-- Additional useful queries and procedures

-- Procedure to get product statistics
DELIMITER //
CREATE PROCEDURE GetProductStats()
BEGIN
    SELECT 
        'Total Products' as metric,
        COUNT(*) as value
    FROM products
    WHERE is_active = TRUE
    
    UNION ALL
    
    SELECT 
        'Out of Stock Products' as metric,
        COUNT(*) as value
    FROM products 
    WHERE is_active = TRUE AND is_in_stock = FALSE
    
    UNION ALL
    
    SELECT 
        'Featured Products' as metric,
        COUNT(*) as value
    FROM products 
    WHERE is_active = TRUE AND featured = TRUE
    
    UNION ALL
    
    SELECT 
        'Average Rating' as metric,
        ROUND(AVG(rating), 2) as value
    FROM products 
    WHERE is_active = TRUE AND rating > 0;
END//
DELIMITER ;

-- Procedure to get sales statistics
DELIMITER //
CREATE PROCEDURE GetSalesStats(IN days_back INT)
BEGIN
    SELECT 
        DATE(created_at) as sale_date,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
    FROM orders 
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL days_back DAY)
        AND status NOT IN ('cancelled', 'refunded')
    GROUP BY DATE(created_at)
    ORDER BY sale_date DESC;
END//
DELIMITER ;

-- Procedure to get customer statistics
DELIMITER //
CREATE PROCEDURE GetCustomerStats()
BEGIN
    SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_customers,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_customers_30_days,
        COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_customers_7_days
    FROM customers 
    WHERE is_active = TRUE;
END//
DELIMITER ;

-- Function to calculate shipping cost
DELIMITER //
CREATE FUNCTION CalculateShipping(order_total DECIMAL(10,2), shipping_method_id INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE shipping_cost DECIMAL(10,2) DEFAULT 0.00;
    DECLARE method_price DECIMAL(10,2);
    DECLARE free_threshold DECIMAL(10,2);
    
    -- Get free shipping threshold
    SELECT CAST(setting_value AS DECIMAL(10,2)) INTO free_threshold
    FROM site_settings 
    WHERE setting_key = 'free_shipping_threshold';
    
    -- Get shipping method price
    SELECT price INTO method_price
    FROM shipping_methods 
    WHERE id = shipping_method_id AND is_active = TRUE;
    
    -- Apply free shipping if order meets threshold
    IF order_total >= free_threshold THEN
        SET shipping_cost = 0.00;
    ELSE
        SET shipping_cost = IFNULL(method_price, 0.00);
    END IF;
    
    RETURN shipping_cost;
END//
DELIMITER ;

-- View for bestselling products
CREATE VIEW bestselling_products AS
SELECT 
    p.*,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status NOT IN ('cancelled', 'refunded') OR o.status IS NULL
GROUP BY p.id
ORDER BY total_sold DESC;

-- View for recent orders with customer info
CREATE VIEW recent_orders_view AS
SELECT 
    o.*,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    c.email as customer_email_verified,
    sm.name as shipping_method_name,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN shipping_methods sm ON o.shipping_method_id = sm.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC;

-- Note: Remember to create appropriate indexes based on your query patterns
-- and consider partitioning large tables like orders if you expect high volume.

-- Performance optimization suggestions:
-- 1. Add composite indexes for frequently queried combinations
-- 2. Consider archiving old orders to separate tables
-- 3. Implement caching for frequently accessed data
-- 4. Monitor query performance and add indexes as needed
-- 5. Consider read replicas for reporting queries