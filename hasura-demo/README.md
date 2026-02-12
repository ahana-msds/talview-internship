#  Logistics Command Center: Secure Real-time Fleet Management

A cutting-edge, real-time **Logistics & Package tracking system** powered by the **Hasura GraphQL Engine** and **React**. This project demonstrates a production-grade implementation of Role-Based Access Control (RBAC), real-time data synchronization, and automated metadata configuration.

---

##  Technical Architecture

- **Engine**: [Hasura v2.40.0](https://hasura.io/) — Instant GraphQL over Postgres with fine-grained security.
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) — Lighting fast UI development.
- **Client**: [Apollo Client](https://www.apollographql.com/docs/react/) — Robust state management for GraphQL.
- **Database**: [PostgreSQL 15](https://www.postgresql.org/) — Relational data store for users and packages.
- **Config**: [Node.js Setup Script](./frontend/scripts/setup-hasura.js) — Automated tracking and permission injection.

---

##  Role-Based Access Control (RBAC)

The system utilizes a secure, multi-tenant permission model. To avoid security conflicts with Hasura's reserved "admin" role, we utilize a **"Manager"** role for administrative actions.

| Role | Access Level | Description |
| :--- | :--- | :--- |
| ** Manager** | **Full Admin** | View all metrics, reassign riders to packages, and create new shipments. |
| ** Agent** | **Assigned Only** | Can accept unassigned packages and update the status of deliveries they own. |
| ** Customer** | **Personal** | Can only track packages they sent or are receiving. |
| ** Public** | **Schema Only** | Unauthenticated access for Login/Signup and generic schema visibility. |

---

##  Key Features

### 1. Smart Signup System
An intelligent authentication flow that auto-generates corporate emails (e.g., `name@customer.com`) based on the selected role, streamlining the onboarding process.

### 2. Real-time Dashboard Metrics
Utilizes **GraphQL Aggregations** to show live counts of total, in-transit, and delivered shipments.
> **Note**: Permissions are configured for the `Public` role to ensure these metrics are visible in the schema even during initial load, preventing UI crashes.

### 3. Live WebSocket Tracking
The `PackageTracker` utilizes `GraphQLWsLink` for true real-time updates. When a manager reassigns a rider, or a rider updates a status, the entire fleet sees it instantly without a refresh.

---

##  Project Structure

```bash
hasura-demo/
├── docker-compose.yml    # Orchestrates Postgres and Hasura services
├── init.sql              # Database schema and seed data (Manager, Agent, etc.)
└── frontend/
    ├── scripts/
    │   └── setup-hasura.js # 🚀 THE MAGIC: Auto-tracks tables, sets RLS
    ├── src/
    │   ├── apollo/
    │   │   └── client.ts   # Configures HTTP & WebSocket links with header logic
    │   ├── components/     # UI Components (Tracker, Modal, Layout)
    │   └── pages/          # Core views (Dashboard, AuthPage)
    └── package.json        # Unified scripts (npm run dev includes setup)
```

---

##  Execution Flow & Setup

Follow these steps in order to get the system running perfectly:

### 1. Launch the Backend
Ensure Docker Desktop is running, then start the engine and database:
```bash
docker-compose up -d
```
*This starts Hasura at [http://localhost:8080](http://localhost:8080) and Postgres at port 5432.*

### 2. Prepare the Frontend
Install the required dependencies:
```bash
cd frontend
npm install
```

### 3. Run Automated Configuration & Dev
The `npm run dev` command is optimized to automatically sync Hasura metadata before starting Vite:
```bash
npm run dev
```
**What this script does:**
- Waits for Hasura to be ready.
- Tracks `users`, `packages`, and `package_logs` tables.
- Establishes relational links (e.g., `packages.agent_id` -> `users.id`).
- Injects 15+ permission rules for RBAC across all roles.

### 4. Authentication Flow
- **Log in** at [http://localhost:5173](http://localhost:5173).
- **Admin account**: `admin@cargo.com` / `password123` (Automatically assigned **Manager** role).
- **Rider account**: `bob@rider.com` / `password123`.

---

##  Technical Deep Dive

### Reserved Role & Security (Admin -> Manager)
We intentionally transitioned from the `admin` role to `manager`. In Hasura, the `admin` role is special and often requires a secret key. Since we have securely removed all `x-hasura-admin-secret` references from our React code, we use `manager` to exercise full table permissions without triggering key requirements.

### Headerless Fallback
The `apollo/client.ts` is configured to send **no headers** when a user is not logged in. This triggers Hasura's `HASURA_GRAPHQL_UNAUTHORIZED_ROLE: public` setting (in `docker-compose.yml`), enabling a secure signup and login experience without exposure.

### WebSocket Flattening
For real-time subscriptions, connection parameters are flattened to ensure compatibility with the `graphql-ws` protocol and Hasura's session recognition.

---

