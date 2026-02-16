# Temporal Practice: Coffee Subscription & Logistics

This project provides a full-functioning demonstration of **Temporal's Distributed Workflow Orchestration** concepts. It uses a "Coffee Subscription" scenario to illustrate long-running, reliable, and deterministic processes.

## 🚀 How to Run

1.  **Start Temporal Server**:
    ```bash
    npm run start:temporal
    ```
2.  **Install Dependencies** (if not done):
    ```bash
    npm install
    cd worker && npm install
    cd ../api && npm install
    cd ../ui && npm install
    cd ..
    ```
3.  **Start Everything**:
    ```bash
    npm run dev
    ```
4.  **Open Dashboard**: [http://localhost:5173](http://localhost:5173)

---

## 🧠 Concepts Demonstrated

### 1. Workflows vs Activities
- **Workflows** (`worker/src/workflows/subscription.ts`): Orchestrate state and decisions. Must be deterministic.
- **Activities** (`worker/src/activities.ts`): Perform side effects like payments, emails, and shipping. They can fail and are retried automatically.

### 2. Deterministic Execution & Event Sourcing
- Temporal ensures workflows are deterministic by replaying the **Event History** to reconstruct state.
- **Demo**: Open the "Event Sourcing Model" section in the UI to see the raw event history recorded by Temporal.

### 3. Workers & Task Queues
- **Worker** (`worker/src/worker.ts`): Polls the `subscription-tasks` queue and executes the workflows/activities.
- **Task Queue**: The communication channel between the Temporal Server and the Workers.

### 4. Workflow Lifecycle: Signals & Queries
- **Signals** (`Pause`, `Resume`, `Cancel`): Asynchronous ways to send data/instructions into a running workflow.
- **Queries** (`getStatus`): Synchronous ways to read the state of a running workflow without affecting its execution.
- **Demo**: Use the Control Panel buttons in the UI to interact with the workflow lifecycle.

### 5. Child Workflows
- The `SubscriptionWorkflow` starts an `OrderWorkflow` for every iteration.
- **Demo**: Observe "Processing" status becoming "Delivered" as the child workflow completes logistics.

### 6. Continue-As-New
- To prevent linear growth of history, the `SubscriptionWorkflow` calls `continueAsNew` after 5 iterations.
- This creates a fresh workflow execution with the same Workflow ID but a new Run ID.

### 7. Workflow Versioning
- Located in `worker/src/workflows/order.ts`. Uses `patch` to demonstrate how to update logic (e.g., Shipping Rules) while maintaining backward compatibility for replaying older histories.

### 8. Activity Resilience
- **Retries**: `processPayment` is configured with a retry policy (check `subscription.ts`). It simulates random failures to show Temporal's automatic recovery.
- **Timeouts & Heartbeats**: `shipOrder` activity sends heartbeats every second to prove it's still alive during long shipping tasks.
- **Cancellation**: If you cancel the subscription, the running `shipOrder` activity receives a cancellation signal and cleans up.

### 9. Idempotency
- The payment activity uses an `idempotencyToken` (WorkflowID + Iteration) to ensure that retrying a payment doesn't result in double charging.

### 10. Long-Running Workflows
- This workflow can theoretically run for years by sleeping and continuing-as-new, showcasing Temporal's ability to manage state over vast periods with zero server memory footprint while sleeping.
