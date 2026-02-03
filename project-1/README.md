# react dashboard project
a comprehensive single page application (spa) built with react, typescript, vite, and redux toolkit. this project demonstrates modern web development practices including authentication, global state management, api integration, and modular styling.

## features

### 1. authentication system
- multiple providers: supports google, github, and email/password login via firebase authentication.
- guest access: simulated guest login for quick access.
- protected routes: dashboard and other protected pages are inaccessible without logging in.
- global state: managed via authcontext to persist user sessions.

### 2. global state management (redux toolkit)
- **client state (cart)**:
  - managed using redux slices.
  - supports adding items, updating quantities, and removing items.
  - persistent cart state across the application session.
- **server state (products)**:
  - managed using rtk query.
  - efficient caching and fetching of product data from dummyjson api.
  - handles loading and error states automatically.

### 3. dynamic dashboard & pages
- **dashboard**: grid layout hosting interactive widgets like todo list.
- **product catalog**:
  - displays products in a responsive 3-column grid.
  - integrated "add to cart" functionality.
- **shopping cart**:
  - dedicated page for managing selected items.
  - real-time calculation of totals.
- **github explorer**: search and view github user profiles.

### 4. theming system
- **theme switcher**: change the look and feel instantly from the navbar.
- **themes available**: minimal (default), ocean, forest.

## tech stack
- core: react 19, typescript, vite
- state management: redux toolkit, rtk query, context api
- routing: react router v7
- styling: css modules + global variables
- backend/auth: firebase v12

## setup instructions
1. clone the repository
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```
2. install dependencies
   ```bash
   npm install
   ```
3. configure environment variables
   - create a file named `.env` in the root directory.
   - copy the contents from `.env.example` and replace the placeholders with your actual firebase config keys.
4. run development server
   ```bash
   npm run dev
   ```
5. build for production
   ```bash
   npm run build
   ```

## project structure
```text
/
├── src/
    ├── app/                  # redux store configuration
    │   └── store.ts          # global store setup
    ├── features/             # redux features (slices & apis)
    │   ├── cart/             # cart feature
    │   │   ├── cartslice.ts  # cart state logic
    │   │   └── cart.tsx      # cart ui component
    │   ├── products/         # products feature
    │   │   ├── productsapi.ts # rtk query api service
    │   │   └── productlist.tsx # product listing ui
    ├── pages/                # main screen views
    │   ├── cartpage.tsx      # dedicated cart page
    │   ├── productpage.tsx   # product catalog page
    │   └── ...               # other pages
    ├── ...                   # other directories
```
