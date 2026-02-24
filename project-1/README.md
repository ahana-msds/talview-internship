# React E-Commerce Dashboard Project

A comprehensive Full-Stack application demonstrating modern web development practices: 
*   **Frontend**: React + Vite + Redux Toolkit
*   **Backend**: Node.js + Express + PostgreSQL
*   **Durable Workflows**: Temporal.io
*   **Monitoring**: Sentry
*   **Durable Workflows**: Temporal.io
*   **Monitoring**: Sentry

## 🚀 Recent Major Updates


### 2. Advanced Clean IDs
All system entities now follow a highly readable, sequential, and descriptive ID naming convention:
- **Users**: `user-1-test`
- **Lists**: `list-1-shopping`
- **Tasks**: `task-1-list-1`
- **Orders**: `order-1-24022026`
- **Workflow**: `workflow-order-1-24022026`
- **Cart Items**: `cart-1-mascara`

> [!NOTE]
> Database primary keys were migrated from `SERIAL` to `TEXT` to support this customized naming convention.

##  Documentation
For a deep dive into each layer, please see:
*   [**Frontend Documentation**](./frontend/doc.md) — UI logic, Cart persistence, state management.
*   [**Backend Documentation**](./backend/doc.md) — Architecture, Stock locking logic, API specs.
*   [**Current Task Walkthrough**](file:///Users/ahanadas/.gemini/antigravity/brain/265b43f5-c8d0-4008-8cc1-e1b24c312c44/walkthrough.md) — Implementation details for Advanced IDs.

##  Quick Setup

### 1. Infrastructure (Docker)
Ensure Docker is running, then start the database and workflow engine:
```bash
# Start Postgres, Temporal, Hasura and Cassandra
docker-compose up -d
```

### 2. Backend Setup
```bash
cd project-1/backend
npm install
npm run seed   # Seeds products into PostgreSQL
npm start      # API on port 4002
# (In a separate terminal)
npm run worker # Temporal Worker
```

### 3. Frontend Setup
```bash
cd project-1/frontend
npm install
npm run dev    # UI on port 5173
```

##  Project Structure
```text
project-1/
├── frontend/             # React + Vite application
├── backend/              # Node.js + Express application
│   ├── src/
│   │   ├── controllers/  # API Controllers (Auth, Order, Payment, etc.)
│   │   ├── utils/        # Utilities (ID Generator, etc.)
│   │   ├── workflows/    # Temporal Workflow logic
│   │   └── index.ts      # Express API server
├── docker-compose.yml    # Full stack orchestration
└── README.md             # This overview
```

