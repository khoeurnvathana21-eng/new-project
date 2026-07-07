-- ============================================================
-- BootZone Database Schema
-- File: database.sql
-- Premium Football Boots E-commerce Store
-- ============================================================

CREATE DATABASE IF NOT EXISTS bootzone
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bootzone;

-- ============================================================
-- Table: brands
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  logo VARCHAR(255) DEFAULT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Table: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  avatar VARCHAR(255) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_expires DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Table: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2) DEFAULT NULL,
  brand_id INT NOT NULL,
  category_id INT NOT NULL,
  surface VARCHAR(80) DEFAULT NULL,
  primary_color VARCHAR(60) DEFAULT NULL,
  sku VARCHAR(80) DEFAULT NULL,
  stock INT NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_new_arrival TINYINT(1) NOT NULL DEFAULT 0,
  is_best_seller TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  images JSON DEFAULT NULL,
  sizes JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE RESTRICT,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_products_brand (brand_id),
  INDEX idx_products_category (category_id),
  INDEX idx_products_price (price),
  INDEX idx_products_active (is_active)
) ENGINE=InnoDB;

-- ============================================================
-- Table: carts
-- ============================================================
CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  size VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_carts_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_carts_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- Table: wishlists
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_wishlist_user_product (user_id, product_id),
  CONSTRAINT fk_wishlists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlists_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_wishlists_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- Table: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSON DEFAULT NULL,
  payment_method VARCHAR(60) DEFAULT 'cod',
  payment_status ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  order_status ENUM('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (order_status)
) ENGINE=InnoDB;

-- ============================================================
-- Table: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_image VARCHAR(255) DEFAULT NULL,
  size VARCHAR(20) DEFAULT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB;

-- ============================================================
-- Table: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(180) DEFAULT NULL,
  comment TEXT,
  is_approved TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_reviews_product (product_id),
  INDEX idx_reviews_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- Table: contacts
-- ============================================================
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  subject VARCHAR(200) DEFAULT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Seed Data: Brands
-- ============================================================
INSERT INTO brands (name, slug, description) VALUES
  ('Nike', 'nike', 'Just Do It. Iconic football boots engineered for speed and precision.'),
  ('Adidas', 'adidas', 'Impossible Is Nothing. Premium boots built for control and comfort.'),
  ('Puma', 'puma', 'Forever Faster. Lightweight boots designed for agility and flair.'),
  ('Mizuno', 'mizuno', 'Japanese craftsmanship for players who demand pure touch and feel.');

-- ============================================================
-- Seed Data: Categories
-- ============================================================
INSERT INTO categories (name, slug, description) VALUES
  ('Firm Ground', 'firm-ground', 'Boots engineered for natural grass pitches.'),
  ('Soft Ground', 'soft-ground', 'Studded boots for wet, muddy natural grass.'),
  ('Artificial Grass', 'artificial-grass', 'Boots built for 3G/4G synthetic surfaces.'),
  ('Indoor', 'indoor', 'Flat-soled boots for indoor futsal and courts.'),
  ('Turf', 'turf', 'Rubber-studded boots for hard turf surfaces.');

-- ============================================================
-- Seed Data: Admin User
-- Default password: admin123 (bcrypt hash below is a placeholder; server creates real hash on first run via /api/auth/seed)
-- ============================================================
INSERT INTO users (first_name, last_name, email, password, role) VALUES
  ('Admin', 'BootZone', 'admin@bootzone.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');

-- ============================================================
-- Seed Data: Products (curated selection)
-- ============================================================
INSERT INTO products
  (name, slug, description, price, compare_price, brand_id, category_id, surface, primary_color, sku, stock, is_featured, is_new_arrival, is_best_seller, images, sizes)
VALUES
  ('Nike Mercurial Superfly 9 Elite', 'nike-mercurial-superfly-9-elite',
   'Engineered for explosive speed, the Mercurial Superfly 9 Elite features a Zoom Air unit and a Vaporposite+ upper for unlocked acceleration and tactile touch.',
   274.99, 310.00, 1, 1, 'Firm Ground', 'Volt Black', 'NK-MS9-001', 24, 1, 1, 1,
   '["https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwe49e1f66/nk/ada/7/a/2/7/6/ada7a276_595a_4228_beb1_1f990c333257.jpg"]',
   '["7","8","9","10","11"]'),

  ('Nike Phantom GX Elite', 'nike-phantom-gx-elite',
   'Precision control meets pure comfort. The Phantom GX Elite uses Gripknit for enhanced ball control in wet and dry conditions.',
   259.99, NULL, 1, 1, 'Firm Ground', 'White Black', 'NK-PG-002', 18, 1, 0, 1,
   '["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,c_scale,w_300,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/f03a2c40-6c16-4f34-811f-9275c057c547/PHANTOM+GX+II+ELITE+FG.png"]',
   '["7","8","9","10","11"]'),

  ('Adidas Predator Accuracy.1', 'adidas-predator-accuracy-1',
   'Control the game with Elements, a Strikeskin upper for grip and accuracy on every pass and shot.',
   249.99, 280.00, 2, 1, 'Firm Ground', 'Red White', 'AD-PA-001', 30, 1, 1, 0,
   '["https://www.prodirectsport.us/cdn/shop/files/281050_main.jpg?v=1782842088"]',
   '["6","7","8","9","10","11"]'),

  ('Adidas X Crazyfast.1', 'adidas-x-crazyfast-1',
   'Built for pure speed. The X Crazyfast features a lightweight Aerocage for explosive sprints and stability.',
   239.99, NULL, 2, 1, 'Firm Ground', 'Solar Red', 'AD-XC-002', 22, 0, 1, 1,
   '["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjq90nOiMTdF88CFr13vmGTMUhvAN4gKDkNUdXByLy3q5fk8Gyi8NzCQk&s=10"]',
   '["7","8","9","10","11"]'),

  ('Puma Future Ultimate', 'puma-future-ultimate',
   'Unleash creativity with the FUZION360 upper and Dynamic Motion System for unrivaled agility and support.',
   219.99, 250.00, 3, 1, 'Firm Ground', 'Yellow Blue', 'PU-FU-001', 16, 1, 0, 0,
   '["https://shoptcrampons.com/cdn/shop/files/401577E5-0147-45CF-98BD-F7324AAB0EAB.webp?v=1766512409&width=2048"]',
   '["7","8","9","10","11"]'),

  ('Puma Ultra Ultimate', 'puma-ultra-ultimate',
   'The fastest boot in the Puma lineup. ULTRAWEAVE upper and SpeedSystem outsole for blistering pace.',
   229.99, NULL, 3, 1, 'Firm Ground', 'White Red', 'PU-UL-002', 20, 0, 1, 1,
   '["https://www.prodirectsport.ie/cdn/shop/files/1011600_main.jpg?v=1778068928"]',
   '["7","8","9","10","11"]'),

  ('Mizuno Morelia Neo III Beta', 'mizuno-morelia-neo-iii-beta',
   'Premium K-leather construction for unmatched touch and feel. Handcrafted in Japan for elite players.',
   269.99, 295.00, 4, 1, 'Firm Ground', 'White Navy', 'MZ-MN-001', 12, 1, 1, 1,
   '["https://www.prodirectsport.us/cdn/shop/files/222558_main.jpg?v=1774360541"]',
   '["7","8","9","10","11"]'),

  ('Mizuno Alpha', 'mizuno-alpha',
   'Innovative engineered upper with a sleek silhouette for players who want both speed and feel.',
   209.99, NULL, 4, 1, 'Firm Ground', 'Black Gold', 'MZ-AL-002', 14, 0, 0, 0,
   '["https://www.prodirectsport.us/cdn/shop/files/1021129_main.jpg?v=1774352200"]',
   '["7","8","9","10","11"]'),

  ('Nike Tiempo Legend 10 Elite', 'nike-tiempo-legend-10-elite',
   'Classic leather craftsmanship meets modern innovation. Soft k-leather upper for supreme touch.',
   244.99, 270.00, 1, 1, 'Firm Ground', 'Black White', 'NK-TL-003', 26, 1, 0, 1,
   '["https://en-kw.sssports.com/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwa75c7817/sss/SSS2/N/K/D/V/4/SSS2_NKDV4328_401_197862798722_1.jpg?sw=700&sh=700&sm=fit"]',
   '["7","8","9","10","11"]'),

  ('Adidas Copa Pure.1', 'adidas-copa-pure-1',
   'Timeless Copa feel with modern Touchpods for cushioned control and classic K-leather touch.',
   219.99, NULL, 2, 2, 'Soft Ground', 'White Black', 'AD-CP-003', 19, 0, 1, 0,
   '["https://shoptcrampons.com/cdn/shop/files/36163E82-0260-420B-8C68-2010F5BB8FD0.webp?v=1739710063&width=2048"]',
   '["7","8","9","10","11"]'),

  ('Puma King Ultimate', 'puma-king-ultimate',
   'The legendary King, reimagined. Premium leather and modern soleplate for the modern playmaker.',
   199.99, 220.00, 3, 3, 'Artificial Grass', 'Black Gold', 'PU-KG-003', 28, 1, 0, 0,
   '["https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/108303/01/sv01/fnd/EEA/fmt/png/KING-ULTIMATE-FG/AG-Football-Boots-Unisex"]',
   '["7","8","9","10","11"]'),

  ('Nike Mercurial Vapor 15 Academy', 'nike-mercurial-vapor-15-academy',
   'Speed for everyone. The Academy edition brings Mercurial performance to a wider audience.',
   89.99, 110.00, 1, 5, 'Turf', 'Volt Black', 'NK-MV-004', 40, 0, 0, 1,
   '["https://www.prokeepersline.com/media/0a/96/ca/1725698981/mercurial-vapor-15-academy-low-top-voetbalschoenen-xlrfvn-png_3fad65d359bddd83.webp?ts=1725698981"]',
   '["7","8","9","10","11","12"]');

-- ============================================================
-- Seed Data: Products (extended catalog - more surfaces/brands)
-- ============================================================
INSERT INTO products
  (name, slug, description, price, compare_price, brand_id, category_id, surface, primary_color, sku, stock, is_featured, is_new_arrival, is_best_seller, images, sizes)
VALUES
  ('Nike Zoom Mercurial Vapor 15 Elite', 'nike-zoom-mercurial-vapor-15-elite',
   'Ultra-lightweight Vaporposite+ upper paired with a Zoom Air unit for explosive first-step acceleration.',
   264.99, 300.00, 1, 1, 'Firm Ground', 'Bright Crimson', 'NK-ZV-005', 20, 1, 1, 0,
   '["https://www.nike.ae/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw38a516f8/nk/d82/f/9/0/3/a/d82f903a_b154_448d_ba3c_1c2848521018.jpg?sw=700&sh=700&sm=fit&q=100&strip=false"]',
   '["6","7","8","9","10","11","12"]'),

  ('Nike Tiempo Legend 10 Academy', 'nike-tiempo-legend-10-academy',
   'Turf-ready version of the Tiempo Legend with a durable rubber outsole built for hard artificial surfaces.',
   94.99, 115.00, 1, 5, 'Turf', 'Black White', 'NK-TA-006', 35, 0, 0, 1,
   '["https://thumblr.uniid.it/product/292423/8d7325ca06da.jpg?width=3840&format=webp&q=75"]',
   '["6","7","8","9","10","11"]'),

  ('Nike React Gato', 'nike-react-gato',
   'Street-inspired indoor boot with a React foam midsole for all-day comfort on hard indoor courts.',
   84.99, NULL, 1, 4, 'Indoor', 'White Volt', 'NK-RG-007', 30, 0, 1, 0,
   '["https://www.futbolemotion.com/imagesarticulos/299697/grandes/zapatilla-nike-tiempo-reactgato-le-liquid-lime-white-0.webp"]',
   '["6","7","8","9","10","11"]'),

  ('Nike Phantom GX Academy', 'nike-phantom-gx-academy',
   'Artificial grass edition of the Phantom GX with Gripknit texture for reliable ball control on 3G pitches.',
   109.99, 130.00, 1, 3, 'Artificial Grass', 'Black Orange', 'NK-PA-008', 26, 0, 0, 0,
   '["https://soccerworldcentral.com/cdn/shop/files/DD9472600.jpg?v=1746537715"]',
   '["7","8","9","10","11"]'),

  ('Adidas Predator League', 'adidas-predator-league',
   'Soft ground Predator built for wet, muddy pitches with conical studs for maximum traction.',
   119.99, 140.00, 2, 2, 'Soft Ground', 'Core Black', 'AD-PL-004', 24, 0, 0, 1,
   '["https://www.prodirectsport.ie/cdn/shop/files/1026125_main.jpg?v=1777465618"]',
   '["6","7","8","9","10","11"]'),

  ('Adidas X Speedportal Messi', 'adidas-x-speedportal-messi',
   'Signature Messi colorway on the X Speedportal, built for explosive acceleration on synthetic turf.',
   199.99, 225.00, 2, 3, 'Artificial Grass', 'Gold Black', 'AD-XM-005', 18, 1, 1, 1,
   '["https://www.vmdboots.com/cdn/shop/files/IMG-5344.webp?v=1736839773&width=1946"]',
   '["7","8","9","10","11"]'),

  ('Adidas Copa Sense.1', 'adidas-copa-sense-1',
   'Indoor version of the Copa Sense with a soft synthetic leather feel and non-marking rubber sole.',
   79.99, NULL, 2, 4, 'Indoor', 'White Pink', 'AD-CS-006', 22, 0, 1, 0,
   '["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjVTaHrbyw5-U891xUuPNqaI2MhcLzAAUxE_RURJXesQ&s=10"]',
   '["6","7","8","9","10"]'),

  ('Adidas Predator Edge Club', 'adidas-predator-edge-club',
   'Entry-level Predator built for turf pitches, featuring rubber studs and a durable synthetic upper.',
   69.99, 85.00, 2, 5, 'Turf', 'Solar Yellow', 'AD-PE-007', 40, 0, 0, 0,
   '["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgFejvrt0H6UEkBxPwh0hS4lwvNDZxcIb-0zOMwXSgrhk_5LvtFAEjzc&s=10"]',
   '["6","7","8","9","10","11","12"]'),

  ('Puma Future Match', 'puma-future-match',
   'Soft ground Future boot with a supportive knit collar and adaptive FUZIONFIT+ compression band.',
   99.99, 120.00, 3, 2, 'Soft Ground', 'Blue Pink', 'PU-FM-004', 20, 0, 1, 0,
   '["https://www.futbolemotion.com/imagesarticulos/225725/750/bota-puma-future-7-match-fgag-gray-skies-white-fizzy-apple-0.webp"]',
   '["7","8","9","10","11"]'),

  ('Puma King Match Indoor', 'puma-king-match-indoor',
   'Classic King silhouette adapted for indoor courts with a grippy gum rubber outsole.',
   74.99, NULL, 3, 4, 'Indoor', 'Black White', 'PU-KM-005', 28, 0, 0, 0,
   '["https://www.futbolemotion.com/imagesarticulos/225676/750/zapatilla-puma-king-match-it-negro-0.webp"]',
   '["6","7","8","9","10","11"]'),

  ('Puma Ultra Match Turf', 'puma-ultra-match-turf',
   'Turf-ready Ultra boot with a lightweight SpeedSystem-inspired sole built for hard synthetic surfaces.',
   79.99, 95.00, 3, 5, 'Turf', 'Fluo Yellow', 'PU-UM-006', 32, 0, 0, 1,
   '["https://www.prodirectsport.it/cdn/shop/files/1019183_main.jpg?v=1777465879"]',
   '["7","8","9","10","11"]'),

  ('Puma Future Ultimate Low AG', 'puma-future-ultimate-low-ag',
   'Artificial grass tuned version of the Future Ultimate with a low-profile AG stud configuration.',
   189.99, 215.00, 3, 3, 'Artificial Grass', 'Green Black', 'PU-FA-007', 16, 1, 0, 0,
   '["https://www.prodirectsport.ie/cdn/shop/files/1019192_main.jpg?v=1778064251"]',
   '["7","8","9","10","11"]'),

  ('Mizuno Rebula Cup', 'mizuno-rebula-cup',
   'Soft ground Rebula built with a synthetic suede-touch upper for confident ball control in wet conditions.',
   129.99, 150.00, 4, 2, 'Soft Ground', 'Navy Gold', 'MZ-RC-003', 15, 0, 1, 0,
   '["https://www.prodirectsport.us/cdn/shop/files/234742_main.jpg?v=1774361414"]',
   '["7","8","9","10","11"]'),

  ('Mizuno Monarcida Neo II Select', 'mizuno-monarcida-neo-ii-select',
   'Artificial grass boot with a lightweight synthetic upper and dual-density AG soleplate.',
   99.99, NULL, 4, 3, 'Artificial Grass', 'White Blue', 'MZ-MN-004', 18, 0, 0, 0,
   '["https://tha.mizuno.com/cdn/shop/files/SH_P1GA232650_00_65fc8e52-e724-4964-8dbc-16b004bdd8ca.png?v=1728386479"]',
   '["7","8","9","10","11"]'),

  ('Mizuno Morelia II Club', 'mizuno-morelia-ii-club',
   'Indoor-friendly version of the iconic Morelia II with a soft K-leather-look upper and flat rubber sole.',
   89.99, 105.00, 4, 4, 'Indoor', 'Black Gold', 'MZ-MC-005', 20, 0, 0, 1,
   '["https://www.prodirectsport.ie/cdn/shop/files/1037508_main.jpg?v=1777465499&width=600"]',
   '["7","8","9","10","11"]');

-- ============================================================
-- Seed Data: Reviews
-- ============================================================
INSERT INTO reviews (user_id, product_id, rating, title, comment) VALUES
  (1, 1, 5, 'Game changer', 'Lightest boot I have ever worn. The speed feels unreal on firm ground.'),
  (1, 3, 5, 'Predator is back', 'The grip on the upper is no joke. Free kicks feel different now.'),
  (1, 7, 5, 'Pure luxury', 'Worth every penny. The leather molds to your foot instantly.'),
  (1, 5, 4, 'Creative freedom', 'Love the fit. Took one game to break in but feels amazing now.');

-- ============================================================
-- End of schema
-- ============================================================
