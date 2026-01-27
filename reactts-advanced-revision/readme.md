Advanced React & TypeScript: Implementation
This guide walkthrough the implementation of professional-grade React and TypeScript concepts, including React Router v7 and advanced server-side typing.

Project Structure
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
Key Concept Explanations
1. React Router v7 (Data-Driven)
In 

App.tsx
, we use loader:

Loader: Fetches data before the component even mounts. This eliminates "loading spinners" inside components and ensures types are ready.
Outlet: Used in the 

Layout
 component to render child routes, maintaining a consistent UI shell.
2. Advanced TypeScript
Mapped in 

shared/types.ts
:

Generics: ApiResponse<T> allows us to reuse the same response structure for Users, Products, or any other data.
Conditional Types: ServerResponse<T> dynamically changes its structure based on whether T is a string or an object.
3. Decorators & Server Typing
In 

server.ts
:

@Log Decorator: Intercepts method calls to log arguments—a common pattern in NestJS or professional backend frameworks.
Server-Side Typing: We use Request and 

Response
 types from Express to ensure our route handlers are type-safe.
4. Event System
Demonstrated in 

App.tsx
:

Synthetic Events: React's 

onClick(e: React.MouseEvent)
 handles cross-browser event normalization.
Custom Events: Using new CustomEvent() and window.dispatchEvent() to communicate between decoupled components or systems.
How to Run
Step 1: Install Dependencies
IMPORTANT

You must run npm install in both the frontend and backend directories first, as many files and configurations were recently added.

# In backend
cd backend && npm install
# In frontend
cd ../frontend && npm install
Step 2: Start Backend
cd backend && npm start
Server will run at http://localhost:3001

Step 3: Start Frontend
cd frontend && npm run dev
Vite will provide the local URL (usually http://localhost:5173)

Verification
Open the frontend URL.
Click "Trigger Events" to see the Custom Event system in action.
Click "Users" in the navbar to trigger the React Router v7 Loader and see the typed list fetched from the backend.