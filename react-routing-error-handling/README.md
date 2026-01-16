
# React Routing & Error Handling Workflow

## Overview

This module demonstrates a **complete, real-world React Router workflow** with a strong focus on **routing, navigation, protected routes, error handling, and debugging**.

The goal of this work was **not just to make routing work**, but to **explicitly demonstrate and test all possible routing and error scenarios** that occur in production React applications.

---

## What I Learned

Through this implementation, I learned how to:

* Implement **client-side routing** using React Router v6
* Create **protected routes** that restrict access based on authentication
* Handle **dynamic routes** using URL parameters
* Gracefully manage **API success and failure scenarios**
* Implement **Error Boundaries** to prevent full app crashes
* Display **404 – Page Not Found** for invalid routes
* Debug runtime issues using:

  * Browser DevTools
  * Network tab
  * React DevTools
* Maintain **clean Git hygiene** while working with large projects

---

## Application Workflow (High-Level)

1. User lands on the **Login page**
2. Authentication state is stored in `localStorage`
3. Protected routes check authentication before rendering
4. Dynamic routes fetch data based on URL parameters
5. API failures are caught and displayed to the user
6. Runtime crashes are caught by an Error Boundary
7. Invalid URLs show a custom 404 page

---

## Route Use-Cases Demonstrated

| Route          | Purpose                                       |
| -------------- | --------------------------------------------- |
| `/`            | Login page                                    |
| `/dashboard`   | Protected route (accessible only after login) |
| `/profile/1`   | Successful API fetch                          |
| `/profile/999` | API error handling                            |
| `/crash`       | Error Boundary demonstration                  |
| `/random-url`  | 404 Page Not Found                            |

---

## Folder Structure

```
src/
├── api/
│   └── userApi.js
├── components/
│   ├── ErrorBoundary.jsx
│   └── Navbar.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Crash.jsx
│   └── NotFound.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── App.jsx
└── main.jsx
```

---

## File-by-File Explanation

### `main.jsx`

* Entry point of the React application
* Wraps the app with:

  * `BrowserRouter` for routing
  * `ErrorBoundary` for global error handling

---

### `App.jsx`

* Central routing configuration
* Defines:

  * Public routes
  * Protected routes
  * Dynamic routes
  * Fallback 404 route

---

### `routes/ProtectedRoute.jsx`

* Acts as a route guard
* Checks authentication using `localStorage`
* Redirects unauthenticated users to the login page

---

### `components/Navbar.jsx`

* Provides navigation links to:

  * Login
  * Dashboard
  * Profile success route
  * Profile error route
  * Crash route
* Handles logout logic

---

### `pages/Login.jsx`

* Simulates authentication
* Stores auth state in `localStorage`
* Redirects user to dashboard after login

---

### `pages/Dashboard.jsx`

* Protected page
* Accessible only when authenticated

---

### `pages/Profile.jsx`

* Demonstrates **dynamic routing**
* Extracts `userId` from the URL
* Fetches user data from an external API
* Handles:

  * Loading state
  * API success
  * API failure

---

### `api/userApi.js`

* Handles API calls
* Centralizes fetch logic
* Throws meaningful errors when:

  * Network fails
  * Invalid user ID is provided

---

### `pages/Crash.jsx`

* Intentionally throws a runtime error
* Used to demonstrate Error Boundary behavior

---

### `components/ErrorBoundary.jsx`

* Prevents the entire application from crashing
* Displays a fallback UI when a runtime error occurs
* Logs error details for debugging

---

### `pages/NotFound.jsx`

* Displays a custom 404 page
* Triggered when no route matches the URL

---

## Error Handling Strategies Used

* **API Errors** → Try/Catch with user-friendly messages
* **Routing Errors** → Wildcard (`*`) route
* **Runtime Errors** → Error Boundary
* **Unauthorized Access** → Redirect using `Navigate`

---

## How to Run the Project

```bash
npm install
npm run dev
```

Then open the local development URL shown in the terminal.

---

## Key Takeaways

* Routing is not just navigation — it requires **state control, error handling, and user flow design**
* Error Boundaries are essential for production-grade React apps
* Explicitly testing failure scenarios leads to more reliable applications
* Clean Git practices are critical when working on real-world repositories

---

## Conclusion

This module demonstrates **industry-level React routing practices**, covering both **happy paths and failure scenarios**, and reflects a strong understanding of **application flow, debugging, and maintainability**.


