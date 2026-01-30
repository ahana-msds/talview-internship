# Node.js & Express.js Study Guide

This guide explains the architecture, workflow, and core concepts implemented in this project.

## 1. Node.js Core Architecture

### The Event Loop
Node.js is single-threaded but handles concurrency through the **Event Loop**.
- **Phase 1: Timers**: Executes `setTimeout` and `setInterval`.
- **Phase 2: I/O Callbacks**: Handles OS-related callbacks (networking, file system).
- **Phase 3: Poll**: Retrieves new I/O events.
- **Phase 4: Check**: Executes `setImmediate`.
- **Phase 5: Close Callbacks**: Handles closure of sockets/handles.

### Core Modules Used
- `fs` (File System): Used in `userService.js` to read and write data. We use the promises API for better readability with `async/await`.
- `path`: Used to build absolute paths (`path.join`). This is critical because relative paths can break depending on where you start the node process.
- `stream`: Used in `fileStream.js`. Streams process data in chunks instead of loading the entire file into memory (the Buffer). This makes the app highly scalable for large files.

## 2. Express.js Fundamentals

### Scalable Project Structure
We use a **Separation of Concerns (SoC)** approach:
- **Routes**: Define the entry points (URLs) and HTTP methods.
- **Controllers**: Act as the middleman. They take the request, call the services, and send back a response.
- **Services**: Contain the "Business Logic". They don't know about Express (req/res); they only care about data.
- **Middleware**: Functions that run "in the middle" of req and res. Used for logging, auth, and parsing.

### Request Handling
- **Route Params (`req.params`)**: Used for identifying specific resources (e.g., `/users/:id`).
- **Query Strings (`req.query`)**: Used for filtering, sorting, or pagination (e.g., `/users?role=admin`).
- **Request Body (`req.body`)**: Used in POST/PUT requests to send complex data. Requires `express.json()` middleware to be readable.

## 3. Asynchronous Programming

### Callbacks vs. Promises vs. Async/Await
- **Callbacks**: The "old" way. Leads to "Callback Hell".
- **Promises**: Represents a value that might be available now, later, or never.
- **Async/Await**: Syntactic sugar over Promises. It makes asynchronous code look and behave like synchronous code, making it much easier to read and debug.

## 4. Workflow of a Request
1. **Client** sends a request (e.g., `GET /api/users/1`).
2. **Middleware** (`logger`) logs the request.
3. **App.js** finds the matching route in `userRoutes.js`.
4. **Route** calls `userController.getUserById`.
5. **Controller** extracts `id` from `req.params`.
6. **Controller** calls `userService.getUserById(id)`.
7. **Service** reads the file asynchronously using `fs`.
8. **Service** returns the data to the Controller.
9. **Controller** sends a JSON response with status `200`.

## 5. Summary Table

| Concept | File Location | Why it matters |
|---------|---------------|----------------|
| GET/POST | `userRoutes.js` | Defines the API interface. |
| route params | `userController.js` | Access specific items by ID. |
| query strings | `userController.js` | Filter and search results. |
| request body | `userController.js` | Create/Update resources. |
| core modules | `userService.js`, `fileStream.js` | Leverages Node.js built-in power. |
| async/await | `userService.js` | Handles I/O without blocking the thread. |
