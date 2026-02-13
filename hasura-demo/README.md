# Logistics Command Center: Secure Real-time Fleet Management

A cutting-edge, real-time **Logistics & Package tracking system** powered by the **Hasura GraphQL Engine**, **PostgreSQL**, and **React**. This project demonstrates a production-grade implementation of Role-Based Access Control (RBAC), real-time data synchronization, serverless function integration, and automated metadata configuration.

---

##  Project Structure & File Information

```bash
hasura-demo/
├── docker-compose.yml       # Orchestrates Postgres, Hasura, and Functions services
├── init.sql                 # Database schema and seed data (Idempotent script)
├── .gitignore               # Ignores node_modules and local postgres-data
├── postgres-data/           # Local persistent storage for Database files (Host-mounted)
├── functions/               # Node.js "Lambda" Service
│   ├── Dockerfile           # Docker config for the functions service
│   ├── package.json         # Dependencies for the backend logic
│   ├── server.js            # Express server wrapping the handler
│   └── handler.js           # Business Logic (Shipping Calculator)
└── frontend/                # React Application
    ├── package.json         # Dependencies and Scripts
    ├── vite.config.ts       # Build configuration
    ├── scripts/
    │   └── setup-hasura.js  # AUTOMATION: Tracks tables, sets permissions, configures Actions
    └── src/
        ├── apollo/
        │   └── client.ts    # Apollo Client with HTTP/WebSocket links & Auth Headers
        ├── components/      # UI Components (NewShipmentModal, PackageTracker, etc.)
        └── pages/           # Core Views (Dashboard, AuthPage)
```

---

##  Configuration Details

These are the critical environment variables and connection strings used in `docker-compose.yml` and `setup-hasura.js`.

###  Security Credentials
- **Hasura General Secret**: `myadminsecretkey`
  - Used as `x-hasura-admin-secret` header to gain root access to Hasura.
  - *Required for the setup script and admin console.*

###  Database Connections
- **PostgreSQL Database URL**:
  ```
  postgres://postgres:postgrespassword@postgres:5432/hasura_demo_db
  ```
  - **Host**: `postgres` (Docker service name)
  - **Port**: `5432`
  - **User**: `postgres`
  - **Password**: `postgrespassword`
  - **DB Name**: `hasura_demo_db`

- **Mounting Hasura to Postgres**:
  The `HASURA_GRAPHQL_METADATA_DATABASE_URL` and `PG_DATABASE_URL` in `docker-compose.yml` use the string above to connect the engine to the data layer.

---

##  How to Run the Project

Follow these steps to launch the entire stack with persistence and automation.

### 1. Start the Infrastructure (Docker)
This command starts **Postgres**, **Hasura Engine**, and the **Functions Service**.
```bash
# In the root 'hasura-demo' directory
docker-compose up -d --build
```
- **Hasura Console**: [http://localhost:8080](http://localhost:8080) (Password: `myadminsecretkey`)
- **Functions API**: [http://localhost:3000](http://localhost:3000)

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Initialize & Start App
Run the development command. This **automatically runs the setup script** to configure Hasura before starting the UI.
```bash
npm run dev
```
**What happens automatically:**
1.  Connects Hasura to the `default` Data Source.
2.  Tracks `users`, `packages`, `package_logs`.
3.  Sets up Relationships (e.g., `package.sender`).
4.  Applies **RBAC Permissions** for Manager, Agent, Customer.
5.  Configures the **Smart Shipping Calculator** Action.

---

##  User Accounts (RBAC)

Login at [http://localhost:5173](http://localhost:5173) with these credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Manager** | `admin@cargo.com` | `password123` | **Full Access**: Create shipments, assign riders, view all data. |
| **Agent** | `bob@rider.com` | `password123` | **Restricted**: Only view/update assigned packages. |
| **Customer**| `ahana@customer.com`| `password123` | **Personal**: Only view own shipments. |

---
##  Key Features Under the Hood

### 1. Data Persistence 
Data is mapped to `./postgres-data` on your host machine.
- **Benefit**: You can run `docker-compose down` and your data **will remain safe**.

### 2. Smart Shipping Calculator 
- **Architecture**: Hasura Action (`Query`) -> `http://functions:3000` -> Node.js Handler.
- **Logic**: Calculates cost based on weight/distance/express. Throws error if > 50kg.

### 3. Real-time Updates 
- **Technology**: GraphQL Subscriptions over WebSockets (`graphql-ws`).
- **Effect**: Updates to package status are instantly pushed to all connected clients.
