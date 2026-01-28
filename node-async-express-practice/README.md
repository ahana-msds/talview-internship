# Node.js Async & Express Mastery Practice

this directory contains standalone, executable scripts designed to deeply explain and demonstrate core Node.js asynchronous patterns and Express.js framework fundamentals.

## project Structure

### express 
*   **`express-routing.js`**: Demonstrates modular routing using `express.Router` and handling of URL parameters.
*   **`express-middleware.js`**: Showcases application-level global middleware vs. route-specific middleware (like a security guard).
*   **`express-req-res.js`**: Explains how to handle various request types: `req.query`, `req.params`, and `req.body`.

### asynchronous 
*   **`async-callbacks.js`**: The foundational pattern for handling asynchronous operations in Node.js.
*   **`async-promises.js`**: Demonstrates the Promise API, chaining `.then()`, and error handling with `.catch()`.
*   **`async-async-await.js`**: Showcases the modern, readable syntax for handling asynchronous operations.
*   **`event-loop-demo.js`**: A laboratory script to visualize the difference between **Microtasks** (Promises) and **Macrotasks** (Timers/IO) within the Node.js Event Loop.

---


### 1. install dependencies
navigate to this directory and install Express:
```bash
cd node-async-express-practice
npm install express
```

### 2. run a demo
you can run any script individually using the `node` command:
```bash
# example: Running the Async/Await demo
node async-async-await.js

# example: Running the Routing demo
node express-routing.js
```

---

##  learning outcomes
*   understand why blocking the Event Loop is dangerous.
*   master the transition from legacy Callbacks to modern Async/Await.
*   build a modular and secure Express API using Middleware and Routers.
