-- =============================================
-- Data Manipulation Language (DML) - INSERT
-- Scenario: Populating the Order Management System
-- Concepts: INSERT, Bulk Insert
-- =============================================

-- 1. Insert Customers
INSERT INTO customers (first_name, last_name, email, phone) VALUES
('Ahana', 'Das', 'ahana.das@example.com', '555-123-4567'),
('Prateek', 'Khurana', 'prateek.khurana@example.com', '555-987-6543'),
('Anika', 'Sharma', 'anika.sharma@example.com', '555-555-5555'),
('De', 'Singh', 'de.singh@example.com', NULL); -- NULL value example

-- 2. Insert Products
INSERT INTO products (name, description, price, stock_quantity, is_active) VALUES
('Laptop Pro X', 'High performance laptop with 16GB RAM', 1200.00, 50, TRUE),
('Wireless Mouse', 'Ergonomic wireless mouse', 25.50, 200, TRUE),
('Mechanical Keyboard', 'RGB Backlit Mechanical Keyboard', 85.00, 75, TRUE),
('Monitor 4K', '27-inch 4K UHD Monitor', 350.00, 30, TRUE),
('USB-C Hub', '7-in-1 USB-C Hub', 45.00, 100, TRUE);

-- 3. Insert Orders
-- Order for Ahana Das
INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES
(1, '2023-10-01 10:00:00', 'DELIVERED', 1225.50),
-- Order for Prateek Khurana
(2, '2023-10-05 14:30:00', 'SHIPPED', 85.00),
-- Order for Anika Sharma
(3, '2023-10-10 09:15:00', 'PENDING', 395.00);

-- 4. Insert Order Items (Linking Orders and Products)
-- Items for Order 1 (Laptop + Mouse)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1200.00), -- 1 Laptop
(1, 2, 1, 25.50);  -- 1 Mouse

-- Items for Order 2 (Keyboard)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(2, 3, 1, 85.00); -- 1 Keyboard

-- Items for Order 3 (Monitor + Hub)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(3, 4, 1, 350.00), -- 1 Monitor
(3, 5, 1, 45.00);  -- 1 Hub

-- 5. Demonstrate INSERT INTO ... SELECT
-- Creating an archive table and moving completed orders (Demonstration only)
CREATE TABLE IF NOT EXISTS archived_orders (
    order_id INTEGER,
    customer_email VARCHAR(100),
    total_amount DECIMAL(12, 2),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert into archive from a select statement
INSERT INTO archived_orders (order_id, customer_email, total_amount)
SELECT o.order_id, c.email, o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'DELIVERED';
