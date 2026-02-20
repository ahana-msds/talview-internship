# Backend Project Idea:
##  Overview
This document captures the core technical philosophy and roadmap for the `project-1` backend. The project is designed as a learning-centric architecture that demonstrates high-reliability patterns for e-commerce and collaborative tools.
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
## The Technical Pillars of Project-1
Instead of a standard CRUD API, the backend for Project-1 is built on three core pillars that ensure it can handle real-world e-commerce edge cases:
### Pillar 1: Durable Life-Cycles (The Order Engine)
Orders in this project aren't just static rows in a database; they are **Live Workflows**.
*   **Context**: Using Temporal.io, we ensure that an order "lives" as a persistent state machine.
*   **Execution**: From the moment a user clicks "Buy Now," the backend initiates a 10-minute lifecycle. This lifecycle manages everything from checking the "DummyJSON" product stock to generating invoices and eventually cleaning up expired holds.
*   **Reliability**: If the server crashes, the workflow engine resumes exactly where it left off, ensuring no customer is ever left in a "Paid but Unconfirmed" state.
### Pillar 2: Atomic Guardrails (The Inventory Logic)
We prevent the "Overselling" problem at the database level rather than the application level.
*   **Context**: High-concurrency environments often suffer from race conditions where two users buy the last item.
*   **Execution**: We use PostgreSQL **Row-Level Locking** (`SELECT FOR UPDATE`). This locks the specific product row during the reservation phase, forcing the database to process requests sequentially.
*   **Feedback**: The system is designed to return a `409 Conflict` immediately if a lock cannot be acquired or if stock has dropped to zero, providing the frontend with clear, actionable error data.
### Pillar 3: Collaborative RBAC (The Permission Registry)
Access control is managed via a shared junction table strategy that integrates deeply with Hasura's security layer.
*   **Context**: Moving beyond simple "My Tasks" to "shared Team Tasks."
*   **Execution**: Every Todo list is governed by a `todo_permissions` record. We verify identity via the `X-User-Email` header, cross-referencing it against the permissions registry for every read or write operation.
*   **Visibility**: Owners have full destructive rights, while Editors are limited to task management—all enforced by backend middleware.
---
## Core Backend Philosophy
*   **Simulated Resilience**: Notifications (Emails/Invoices) are currently simulated via structured logging. This keeps the project decoupled from external API keys while maintaining a "Production-Ready" logic flow.
*   **Progressive Persistence**: The backend acts as the authoritative source for the Cart, but allows the UI to stay snappy via optimistic Redux state, syncing data in the background only after validation.
*   **Fail-Fast Security**: Prices, discount logic, and stock availability are never trusted from the client. The backend re-validates every line item from its own PostgreSQL truth.
---
##  Status & Open Ends
This document serves as the **Vision**. While core parts (Stock Reservation, Temporal Workflows, Cart Persistence) are implemented, the following are "Ideas-in-Progress" to be integrated as the learning journey continues:
*   Real-time Hasura subscriptions for the Admin dashboard.
*   Full Sentry-to-DB mapping for bug tracking.
*   Automated Lambda-driven DB patches for common "Resolve" actions.