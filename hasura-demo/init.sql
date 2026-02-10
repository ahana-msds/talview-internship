-- Create tables for Hasura Demo
-- 1. Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Todos Table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Data
INSERT INTO users (username, role) VALUES 
('admin_user', 'admin'),
('regular_user', 'user'),
('guest_user', 'user');

INSERT INTO todos (title, is_completed, user_id, is_public) VALUES
('Welcome to Hasura Demo', false, 1, true),
('Admin Task: Review logs', false, 1, false),
('User Task: Complete tutorial', false, 2, false),
('User Task: Setup React App', true, 2, false);
