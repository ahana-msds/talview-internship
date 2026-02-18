# Backend Project Idea:

##  Overview
This document captures the core technical philosophy and roadmap for the `project-1` backend. The project is designed as a learning-centric "Skeleton Architecture" that demonstrates high-reliability patterns for e-commerce and collaborative tools.

Rather than just a simple API, this backend serves as a showcase for **Durable Execution**, **Durable State**, and **Human-in-the-Loop** systems.

---

##  Scenario 1: Resilient Checkout with "Human-in-the-Loop"

We treat the order pipeline not as a series of instant database updates, but as a long-running, resilient process with a built-in "Correction Window."

### The Workflow Flow:
1.  **Initialization:** When a user clicks "Buy Now," the order is created in PostgreSQL (or via Hasura) in a `PENDING` state.
2.  **Grace Period:** A Temporal Workflow starts and enters a **5-minute "Correction Window"** (using `workflow.sleep`).
3.  **The Correction (Signal):** If the user realizes they entered the wrong address, they can click "Edit Address" in the UI. This sends a **Temporal Signal** to the running workflow. The workflow catches this signal and updates its internal state before the timer expires.
4.  **Admin Intervention (Signal):** An Admin, monitoring the dashboard via Hasura Subscriptions, can "Signal" the workflow to manually override statuses (e.g., force-confirming a stuck payment or cancelling a suspicious order).
5.  **Finalization:** Once the window closes or signals are processed, Temporal proceeds to secondary activities (Stock reduction, Invoice generation, Email dispatch).

---

##  Scenario 2: Multi-User Task Engine with RBAC

Moving beyond private lists to a **Permission-Based Collaboration** system enforced at the data layer.

### The Logic:
*   **Postgres Schema:** 
    *   `todo_lists`: Stores metadata (shared IDs, list names).
    *   `todo_permissions`: A junction table mapping `user_id` to `list_id` with specific roles (`owner`, `editor`, `viewer`).
*   **Hasura Row-Level Security (RLS):** This is the core enforcement mechanism. Instead of complex application code, we configure Hasura so that:
    *   A `SELECT` on `todos` only works if the `X-Hasura-User-Id` exists in `todo_permissions` for that list.
    *   Only `owners` can delete a list.
*   **Admin Bypass:** The Admin role has a "Master Bypass," allowing for system-wide auditing and list membership management (e.g., adding user B to user A's list per support request).

---

##  Scenario 3: Admin Request & Control Center

A unified "Internal Flagging" system that bridges the gap between Frontend UI issues and Backend data fixes.

### The Flow:
1.  **Frontend Signaling:** A "Flag Issue" button allows users to report bugs or glitches directly from a specific Product or Order page.
2.  **Data Capture:** The request is saved to an `admin_requests` table.
3.  **Sentry Integration:** Using the Sentry User Feedback API, we attach a **stack trace and console logs** to this DB record. When the Admin views the request, they see the exact technical context of the failure.
4.  **Admin Action:** The Admin can click "Resolve" or "Retry," which triggers a **Lambda** to either patch the data in Postgres or signal the Temporal worker to retry a failed activity.

---

##  Technical Integration Stack

### Backend Structure (/backend)
*   **Hasura (GraphQL Layer):**
    *   **Permissions:** Granular roles (`user`, `admin`).
    *   **Remote Schemas:** Connecting custom Node.js logic as GraphQL actions.
*   **Temporal (Workflows):**
    *   **Signals:** Real-time updates to running processes (Address changes).
    *   **Queries:** Providing internal "peeks" into the state of a live order workflow.
*   **Node.js / Express (Service Layer):**
    *   Serving as the "Starter" for workflows.
    *   Managing logic that doesn't fit into pure RLS or pure Workflow functions.

## 🏗️ Core Backend Modules & Responsibilities

### 1. Product Management
*   Provide high-performance product listing and detail APIs.
*   Handle complex filtering, search, and pagination on the server.
*   Ensure data consistency and schema validation for all product entries.

### 2. Cart Management
*   Securely store cart data in PostgreSQL for cross-device persistence.
*   Handle CRUD operations (Add, Remove, Update) for cart items.
*   Validate product existence and requested quantity against real-time stock.
*   Calculate totals (subtotal, tax, discounts) securely on the server side.

### 3. Inventory System
*   Track real-time stock levels per product.
*   **Prevent overselling** during concurrent requests using database locks.
*   Reduce stock immediately upon reservation to protect inventory.
*   Ensure all inventory updates are atomic database operations.

### 4. Reserve Inventory Flow
*   Create short-lived reservations with a configurable expiration time (e.g., 10-15 mins).
*   Lock stock temporarily to "hold" it for the user.
*   Start a **Temporal workflow** for precise timeout handling.
*   Release stock automatically if payment fails or the session times out.

### 5. Payment Processing
*   Create secure payment sessions (Stripe/Razorpay).
*   Verify payment completion via **authenticated webhooks**.
*   Update order status and confirm stock only after verified payment.
*   Implement server-side verification to prevent common fraud patterns.

### 6. Order Management
*   Convert temporary reservations into confirmed, permanent orders.
*   Store detailed order snapshots (price, title) to ensure historical accuracy.
*   Link Users, Payments, and Inventory records in a relational model.
*   Maintain and track the complete order lifecycle (Pending -> Paid -> Shipped).

### 7. Workflow Management (Temporal)
*   Manage long-running, asynchronous processes with durable state.
*   Handle transient failures (e.g., API timeouts) with automatic retries.
*   Maintain **Idempotency** for all operations to prevent duplicate orders.
*   Orchestrate complex logic like reservation expiration and cleanup.

### 8. Database Management
*   Manage relational schemas for Users, Products, Inventory, Orders, and Payments.
*   Enforce data integrity through Foreign Keys and Constraints.
*   Implement performance optimizations via indexing and query tuning.

---

## 🏛️ Core Backend Principles
*   **Frontend handles UI/UX**: Focus on presentation, user interaction, and optimistic states.
*   **Backend handles Truth**: All business logic, security enforcement, and data persistence reside on the server.
*   **Server-Side Validation**: Never trust client-side data; all critical operations (price, stock, roles) MUST be validated on the server.

---

##  Status & Open Ends
This document serves as the **Vision**. While core parts (Stock Reservation, Temporal Workflows, Cart Persistence) are implemented, the following are "Ideas-in-Progress" to be integrated as the learning journey continues:
*   Real-time Hasura subscriptions for the Admin dashboard.
*   Full Sentry-to-DB mapping for bug tracking.
*   Automated Lambda-driven DB patches for common "Resolve" actions.
