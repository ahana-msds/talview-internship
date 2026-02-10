-- =============================================
-- Data Manipulation Language (DML)
-- Scenario: Querying, Updating, and Deleting Data
-- Concepts: SELECT, JOIN, SUBQUERY, UPDATE, DELETE
-- =============================================

-- 1. SELECT and Filtering
-- Simple Select with WHERE clause
SELECT * FROM products WHERE price > 50.00;

-- Selecting specific columns with Alias
SELECT first_name AS "First Name", last_name AS "Last Name" FROM customers;

-- 2. JOINS
-- Inner Join: Get all orders with customer details
SELECT 
    o.order_id,
    o.order_date,
    c.first_name,
    c.last_name,
    o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;

-- Left Join: Get all customers, even those without orders
-- This helps identify potential leads who registered but haven't bought anything.
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    COUNT(o.order_id) as total_orders
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name;

-- 3. SUBQUERIES
-- Find products that have a price higher than the average price of all products
SELECT name, price 
FROM products 
WHERE price > (SELECT AVG(price) FROM products);

-- Correlated Subquery: Find customers who have made an order totaling more than $1000
SELECT first_name, last_name 
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id 
    AND o.total_amount > 1000
);

-- 4. UPDATE
-- Update stock quantity after a restocking event
UPDATE products 
SET stock_quantity = stock_quantity + 50 
WHERE name = 'Wireless Mouse';

-- Update order status based on a condition
UPDATE orders
SET status = 'SHIPPED'
WHERE status = 'PENDING' AND order_date < NOW() - INTERVAL '2 days';

-- 5. DELETE
-- Delete a specific order item (e.g., cancelled item)
DELETE FROM order_items 
WHERE order_id = 3 AND product_id = 5; -- Removing the USB Hub from Order 3

-- Delete inactive products (if any exist)
DELETE FROM products 
WHERE is_active = FALSE;

-- Create View of Order details with product and customer info
CREATE OR REPLACE VIEW order_details_view AS
SELECT 
    o.order_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    p.name AS product_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN customers c ON o.customer_id = c.customer_id;

-- Query the View
SELECT * FROM order_details_view;
