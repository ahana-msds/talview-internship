-- =============================================
-- Data Definition Language (DDL)
-- Scenario: Order Management System
-- Concepts: Tables, Constraints, Data Types, Normalization (3NF)
-- =============================================

-- 1. Create Tables ensuring 3NF (No transitive dependencies)

-- CUSTOMERS Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY, -- Integer Data Type & PK Constraint
    first_name VARCHAR(50) NOT NULL, -- Text Data Type & Not Null Constraint
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, -- Unique Constraint
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date/Time Data Type
);

-- PRODUCTS Table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0), -- Check Constraint for positive price
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE -- Boolean Data Type
);

-- ORDERS Table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED')), -- Check Constraint
    total_amount DECIMAL(12, 2) DEFAULT 0.00,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE -- Foreign Key Constraint
);

-- ORDER_ITEMS Table (Many-to-Many Relationship Resolution)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL, -- Price at the time of purchase
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- VIEWS
-- A view to simplify complex joins for reporting
CREATE OR REPLACE VIEW order_summary_view AS
SELECT 
    o.order_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    o.order_date,
    o.status,
    o.total_amount,
    COUNT(oi.product_id) as unique_items_count
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, c.first_name, c.last_name;

-- INDEXES
-- Improving performance for frequent lookups
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
