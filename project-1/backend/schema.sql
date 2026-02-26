-- ============================================
-- Talview Project-1: PostgreSQL Schema
-- ============================================

-- Drop existing tables to apply schema changes (SERIAL to TEXT)
DROP TABLE IF EXISTS stock_reservations CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS admin_requests CASCADE;
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS todo_permissions CASCADE;
DROP TABLE IF EXISTS todo_lists CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 1. Todo Lists Table
CREATE TABLE IF NOT EXISTS todo_lists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.1 Users Table (for JWT Auth)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'admin', 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Todo Permissions Table (RBAC - sharing)
CREATE TABLE IF NOT EXISTS todo_permissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    list_id TEXT REFERENCES todo_lists(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')),
    UNIQUE(user_id, list_id)
);

-- 3. Todos Table
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    list_id TEXT REFERENCES todo_lists(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    workflow_id TEXT,
    user_email TEXT NOT NULL DEFAULT 'guest',
    address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Admin Requests Table
CREATE TABLE IF NOT EXISTS admin_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    sentry_id TEXT,
    order_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Products Table (seeded from DummyJSON)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    brand TEXT,
    category TEXT,
    thumbnail TEXT,
    images JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Cart Items Table (per-user persistence)
CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    thumbnail TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, product_id)
);

-- 8. Stock Reservations Table (temporary holds during checkout)
CREATE TABLE IF NOT EXISTS stock_reservations (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'HELD'
        CHECK (status IN ('HELD', 'CONFIRMED', 'RELEASED')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Seed Data
-- ============================================

-- Seed users (Default Admin)
INSERT INTO users (id, email, password_hash, role) 
VALUES ('user-0-admin', 'admin@example.com', 'Admin123', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Default "General Tasks" list (accessible to everyone)
INSERT INTO todo_lists (id, name, owner_id) VALUES ('list-1', 'General Tasks', 'guest')
ON CONFLICT (id) DO NOTHING;

-- Sample todos for General Tasks
INSERT INTO todos (id, text, completed, list_id) VALUES ('task-1-list-1', 'Task 1', false, 'list-1')
ON CONFLICT (id) DO NOTHING;
INSERT INTO todos (id, text, completed, list_id) VALUES ('task-2-list-1', 'Task 2', true, 'list-1')
ON CONFLICT (id) DO NOTHING;
