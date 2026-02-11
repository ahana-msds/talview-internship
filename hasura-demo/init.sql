-- 1. Users Table with Roles and Regions
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('manager', 'agent', 'customer')),
  region TEXT DEFAULT 'global',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Packages Table for Real-time Tracking
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL DEFAULT 'TRK' || floor(random() * 1000000)::text,
  contents TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'delivered')),
  sender_id INTEGER REFERENCES users(id),
  sender_name TEXT,
  sender_phone TEXT,
  sender_address TEXT,
  receiver_id INTEGER REFERENCES users(id),
  receiver_name TEXT,
  receiver_phone TEXT,
  receiver_address TEXT,
  agent_id INTEGER REFERENCES users(id),
  location_lat DECIMAL(9,6) DEFAULT 0,
  location_lng DECIMAL(9,6) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Audit Logs for Status Tracking
CREATE TABLE package_logs (
  id SERIAL PRIMARY KEY,
  package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Data
INSERT INTO users (username, email, password, role, region) VALUES 
('cargo_admin', 'admin@cargo.com', 'password123', 'manager', 'global'),
('rider_bob', 'bob@rider.com', 'password123', 'agent', 'north'),
('rider_alice', 'alice@rider.com', 'password123', 'agent', 'south'),
('customer_ahana', 'ahana@customer.com', 'password123', 'customer', 'global'),
('customer_prateek', 'prateek@customer.com', 'password123', 'customer', 'global');

INSERT INTO packages (tracking_number, contents, status, sender_id, receiver_id, agent_id, location_lat, location_lng) VALUES
('TRK001', 'MacBook Air - Repairs', 'in_transit', 4, 1, 2, 40.7128, -74.0060),
('TRK002', 'Headphones - Order #123', 'pending', 1, 5, NULL, 34.0522, -118.2437),
('TRK003', 'Gaming Mouse', 'delivered', 4, 5, 3, 51.5074, -0.1278);

INSERT INTO package_logs (package_id, status, note) VALUES
(1, 'pending', 'Order received'),
(1, 'picked_up', 'Picked up by Rider Bob'),
(1, 'in_transit', 'Departed sorting facility');
