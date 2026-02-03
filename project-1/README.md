# react dashboard project

a comprehensive single page application (spa) built with react, typescript, vite, and redux toolkit. this project demonstrates modern web development practices including authentication, global state management, validation, testing, and component-driven ui development.

## features

### 1. authentication system
- **multiple providers**: supports google, github, and email/password login via firebase authentication.
- **guest access**: simulated guest login for quick access.
- **protected routes**: dashboard and other protected pages are inaccessible without logging in.
- **global state**: managed via `authcontext` to persist user sessions.

### 2. global state management (redux toolkit)
- **client state (cart)**:
  - managed using redux slices.
  - supports adding items, updating quantities, and removing items.
  - persistent cart state across the application session.
- **server state (products)**:
  - managed using rtk query.
  - efficient caching and fetching of product data from dummyjson api.
  - handles loading and error states automatically.

### 3. validation & type safety
- **zod**: used for runtime validation of forms (e.g., email validation).
- **typebox**: used for validating api response schemas (e.g., product data).
- **path aliases**: configured `@/` to map to `src/` for clean imports.

### 4. testing & quality assurance
- **vitest**: fast unit test runner configured with `jsdom`.
- **testing library**: used for component testing.
- **unit tests**: coverage for validation logic and core utilities.
- **command**: `npm test` runs the full test suite.

### 5. ui development (storybook)
- **component driven**: develop components in isolation.
- **interactive stories**:
  - **login page**: simulate network delays and error states.
  - **dashboard**: toggle user providers and themes dynamicall.
  - **cart**: add/remove items using interactive controls.
- **command**: `npm run storybook` starts the ui explorer.

### 6. dynamic dashboard & pages
- **dashboard**: grid layout hosting interactive widgets.
- **product catalog**: displays products with "add to cart" functionality.
- **shopping cart**: real-time calculation of totals.
- **github explorer**: search and view github user profiles.

## tech stack
- **core**: react 19, typescript, vite
- **state management**: redux toolkit, rtk query, context api
- **validation**: zod, typebox
- **testing**: vitest, react testing library
- **ui/docs**: storybook 8
- **styling**: css modules + global variables
- **backend/auth**: firebase v12

## setup instructions

1. **clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **install dependencies**
   ```bash
   npm install
   ```

3. **configure environment variables**
   - create `.env` in the root directory.
   - add your firebase config keys (see `.env.example`).

4. **run development server**
   ```bash
   npm run dev
   ```

5. **run tests**
   ```bash
   npm test
   ```

6. **run storybook**
   ```bash
   npm run storybook
   ```

## project structure
```text
/
├── src/
│   ├── app/                  # redux store configuration
│   ├── components/           # reusable ui components
│   ├── contexts/             # react contexts (auth, theme)
│   ├── features/             # redux features (slices & apis)
│   │   ├── cart/             # cart logic & ui
│   │   ├── products/         # product api logic & ui
│   ├── lib/                  # utilities (validation schemas)
│   ├── pages/                # main application pages
│   ├── stories/              # storybook stories (*.stories.tsx)
│   └── tests/                # global test setup
├── .storybook/               # storybook configuration
├── vitest.config.ts          # test runner config
└── vite.config.ts            # bundler config
```
