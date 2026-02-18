# React E-Commerce Dashboard Project

A comprehensive Full-Stack application demonstrating modern web development practices: 
*   **Frontend**: React + Vite + Redux Toolkit
*   **Backend**: Node.js + Express + PostgreSQL
*   **Durable Workflows**: Temporal.io
*   **Monitoring**: Sentry

## 📚 Documentation
For a deep dive into each layer, please see:
*   [**Frontend Documentation**](./frontend/doc.md) — UI logic, Cart persistence, state management.
*   [**Backend Documentation**](./backend/doc.md) — Architecture, Stock locking logic, API specs.
*   [**System Walkthrough**](file:///Users/ahanadas/.gemini/antigravity/brain/01e3612c-0c27-47d8-b231-1a404aa1974a/walkthrough.md) — Global overview and setup guide.

## 🚀 Quick Setup

### 1. Infrastructure (Docker)
Ensure Docker is running, then start the database and workflow engine:
```bash
# Start Postgres and Temporal containers
docker start backend-postgres-1 backend-temporal-1
```

### 2. Backend Setup
```bash
cd project-1/backend
npm install
npm run seed   # Seed 200 products to Postgres
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

## 🏗️ Project Structure
```text
project-1/
├── frontend/             # React + Vite application
│   ├── src/              # Components, Redux slices, Pages
│   └── doc.md            # Frontend deep-dive
├── backend/              # Node.js + Express application
│   ├── src/
│   │   ├── activities/   # Temporal Activity implementations
│   │   ├── workflows/    # Temporal Workflow logic
│   │   └── index.ts      # Express API server
│   └── doc.md            # Backend deep-dive
├── docker-compose.yml    # Full stack orchestration
└── README.md             # This overview
```

