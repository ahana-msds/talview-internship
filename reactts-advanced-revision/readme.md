# Advanced React & TypeScript Mastery
This project demonstrates professional-grade React and TypeScript concepts, including **React Router v7 loaders**, **shared server-side typing**, and **advanced TypeScript patterns**.
---
## Project Structure
```text
/reactts-advanced-revision
├── shared/
│   └── types.ts        # Shared Enums, Generics, and Intersection types
├── backend/
│   ├── package.json
│   ├── tsconfig.json   # Decorators enabled
│   └── server.ts       # Express server with typed routes
└── frontend/
    └── src/
        ├── App.tsx     # React Router v7 (Loaders/Layouts) & Events
        └── types/
            └── guards.ts # Type Guards and Assertions
```
---
## Key Concept Explanations
### 1. React Router v7 (Data-Driven)
In `App.tsx`, we implement the modern v7 pattern:
- **Loader**: Fetches data *before* the component mounts, eliminating loading spinners and ensuring type-safe data is ready on render.
- **Outlet**: Used in the `Layout` component to render child routes, maintaining a consistent UI shell across the app.
### 2. Advanced TypeScript
Mapped in `shared/types.ts`:
- **Generics**: `ApiResponse<T>` allows for reusable response structures across various data types (Users, Products, etc.).
- **Conditional Types**: `ServerResponse<T>` dynamically alters its structure based on whether `T` is a string or an object.
### 3. Decorators & Server Typing
In `server.ts`:
- **@Log Decorator**: Intercepts method calls to log arguments—a common pattern in professional frameworks like NestJS.
- **Server-Side Typing**: Utilizes Express `Request` and `Response` types to ensure route handlers are strictly typed.
### 4. Event System
Demonstrated in `App.tsx`:
- **Synthetic Events**: React's `onClick(e: React.MouseEvent)` wrapper for cross-browser event normalization.
- **Custom Events**: Native `CustomEvent()` and `window.dispatchEvent()` for communication between decoupled systems.
---
## How to Run
### Step 1: Install Dependencies
> [!IMPORTANT]
> You must run `npm install` in both the `frontend` and `backend` directories.
```bash
# In backend
cd backend && npm install
# In frontend
cd ../frontend && npm install
```
### Step 2: Start Backend
```bash
cd backend && npm start
```
*Server runs at http://localhost:3001*
### Step 3: Start Frontend
```bash
cd frontend && npm run dev
```
*Vite will provide the local URL (usually http://localhost:5173)*
---
## Verification
1.  **Open the frontend URL.**
2.  **Trigger Events**: Click the "Trigger Events" button to see the Custom Event system in action via console and UI.
3.  **V7 Routing**: Click "Users" in the navbar to trigger the **React Router v7 Loader** and view the instantly-appearing typed list fetched from the backend.
