# Logistics Command Center: Hasura & React Demo

A real-time **Logistics & Package Tracking System** demonstration using **Hasura GraphQL Engine** and **React + Apollo Client**.

## 🚚 Logistics Scenario
This project simulates a delivery network with three key roles:
- **Admin**: Full visibility into all packages globally.
- **Agent (Rider)**: Can track and update packages assigned to them.
- **Customer**: Can only see real-time updates for packages they sent or are receiving.

## 🚀 Advanced Hasura Features

### 1. Real-time Subscriptions & Row-Level Security (RLS)
The `PackageTracker` uses GraphQL Subscriptions to listen for coordinate changes in the `packages` table.
- **Learning Point**: Subscriptions automatically respect **Access Control** rules. If a Customer is logged in, they only receive updates for *their* packages because of the Row-Level Permissions defined in Hasura.

### 2. Access Control (Permissions)
Configured in the Hasura Console (**Data -> [Table] -> Permissions**):
- **Select Permission (Customer)**: `{"_or": [{"sender_id": {"_eq": "X-Hasura-User-Id"}}, {"receiver_id": {"_eq": "X-Hasura-User-Id"}}]}`
- **Update Permission (Agent)**: Allowed only on `status` and `location` columns where `agent_id == X-Hasura-User-Id`.

### 3. Custom Actions (Extending Functionality)
Custom Actions allow you to integrate REST APIs or serverless functions into your GraphQL schema.
- **Logic**: Use an Action to `calculate_shipping_cost`.
- **Workflow**: Hasura receives the GraphQL call -> Forwards it as a REST POST to your Node.js/Python webhook -> Returns the result to the client.

### 4. Remote Schemas (Unified Graph)
You can stitch existing GraphQL APIs (like weather or currency services) into Hasura.
- **Scenario**: Stitch a Weather API to show weather conditions at the package's current `location_lat/lng`.

## 🛠️ Performance & Error Monitoring
Managed in `src/apollo/client.ts`:
- **Error Link**: Intercepts and logs all GraphQL and Network errors to the console (perfect for debugging permission issues).
- **Performance Link**: Logs operation duration (ms) for every query and mutation to help identify slow resolvers.

## 🏃 Running the Project

1. **Backend**: `cd hasura-demo && docker-compose up -d`
2. **Hasura Console**: Go to [http://localhost:8080](http://localhost:8080) and **Track All** tables in the `public` schema.
3. **Frontend**: `cd frontend && npm install && npm run dev`
