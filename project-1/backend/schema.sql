-- 1. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    address TEXT NOT NULL,
    items JSONB NOT NULL,
    workflow_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Todo Lists Table
CREATE TABLE IF NOT EXISTS todo_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Todo Permissions Table (RBAC)
CREATE TABLE IF NOT EXISTS todo_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    list_id UUID REFERENCES todo_lists(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')),
    UNIQUE(user_id, list_id)
);

-- 4. Admin Requests Table
CREATE TABLE IF NOT EXISTS admin_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    sentry_id TEXT,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hasura RLS Simulation (Logic to be applied in Hasura Console)
-- For todo_lists/todos:
-- Role: user
-- Query: { "_or": [ { "owner_id": { "_eq": "X-Hasura-User-Id" } }, { "todo_permissions": { "user_id": { "_eq": "X-Hasura-User-Id" } } } ] }
