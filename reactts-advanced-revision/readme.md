# Advanced React & TypeScript 

this project demonstrates React and TypeScript concepts, including **React Router v7 loaders**, **shared server-side typing**, and **advanced TypeScript patterns**.

---

## project structure

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

##  concept 

### 1. react router v7 (data-driven)
in `App.tsx`, we implement the modern v7 pattern:
- **Loader**: fetches data *before* the component mounts, eliminating loading spinners and ensuring type-safe data is ready on render.
- **Outlet**: used in the `Layout` component to render child routes, maintaining a consistent UI shell across the app.
- **V6 Comparison**: this project also includes a side-by-side comparison with the **v6 approach** (component-based fetching with `useEffect`) to show the differences in lifecycle and performance.

### 2. advanced TS
mapped in `shared/types.ts`:
- **Generics**: `ApiResponse<T>` allows for reusable response structures across various data types (Users, Products, etc.).
- **Conditional Types**: `ServerResponse<T>` dynamically alters its structure based on whether `T` is a string or an object.

### 3. decorators & server typing
in `server.ts`:
- **@Log Decorator**: intercepts method calls to log arguments—a common pattern in professional frameworks like NestJS.
- **Server-Side Typing**: utilizes Express `Request` and `Response` types to ensure route handlers are strictly typed.

### 4. event system
demonstrated in `App.tsx`:
- **Synthetic Events**: react's `onClick(e: React.MouseEvent)` wrapper for cross-browser event normalization.
- **Custom Events**: native `CustomEvent()` and `window.dispatchEvent()` for communication between decoupled systems.

---

## how to run

### step 1: install dependencies
> [!IMPORTANT]
> you must run `npm install` in both the `frontend` and `backend` directories.

```bash
# in backend
cd backend && npm install

# in frontend
cd ../frontend && npm install
```

### step 2: start backend
```bash
cd backend && npm start
```
*server runs at http://localhost:3001*

### step 3: start frontend
```bash
cd frontend && npm run dev
```
*vite will provide the local URL (usually http://localhost:5173)*

---

## verification
1.  **open the frontend URL.**
2.  **Trigger Events**: click the "Trigger Events" button to see the Custom Event system in action via console and UI.
3.  **V7 Routing**: click "Users" in the navbar to trigger the **React Router v7 Loader** and view the instantly-appearing typed list fetched from the backend.
4.  **V6 Comparison**: click "Users (v6 useEffect)" to see the legacy fetching pattern with its corresponding loading states.
