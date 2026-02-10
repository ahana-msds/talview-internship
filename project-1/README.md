# react dashboard project

a comprehensive single page application (spa) built with react, typescript, vite, and redux toolkit. this project demonstrates modern web development practices including authentication, global state management, validation, testing, and component-driven ui development.

## features

### 1. authentication system
- **multiple providers**: supports google, github, and email/password login via firebase authentication.
- **guest access**: simulated guest login for quick access.
- **protected routes**: dashboard and other protected pages are inaccessible without logging in.
- **global state**: managed via `authcontext` to persist user sessions.
- **enhanced validation**: enforced complex password requirements (uppercase, lowercase, numbers) using zod.

### 2. global state management (redux toolkit)
- **client state (cart)**:
  - managed using redux slices.
  - supports adding items, updating quantities, and removing items.
  - persistent cart state across the application session.
- **server state (products)**:
  - managed using rtk query.
  - efficient caching and fetching from dummyjson api.
  - handles loading and error states automatically.

### 3. error tracking & monitoring (sentry)
- **centralized reporting**: automatic capture of api failures and runtime crashes.
- **real-time alerts**: integrated with sentry dashboard for immediate feedback.
- **smart filtering**: automatically ignores common 404 search errors to reduce noise.
- **pii enabled**: captures user context and device info for easier debugging.

### 4. validation & type safety
- **zod**: centralized schemas for form validation and login logic.
- **typebox**: schema validation for api response data.
- **path aliases**: configured `@/` mapping for clean imports.

### 5. testing & quality assurance
- **vitest**: standard test runner for unit and integration tests.
- **react testing library**: used for verifying component behaviors.
- **coverage**: unit tests for validation logic and password complexity.

### 6. Product Detail View
- **Single Product Fetch**: Detailed view for individual items with full description and high-res images.
- **Dynamic Quantity**: Select desired quantity before adding to the cart.
- **Window Isolation**: Product details open in a new window/tab for focus, with auto-close support when navigating back.
- **Quick Purchase**: "Buy Now" button for immediate checkout flow.

### 7. Account & Profile Management
- **Profile Dropdown**: Interactive user menu in the Navbar.
- **Personal Information**: Update display name (Firebase) and Birthday (LocalStorage).
- **Security Check**: Password change feature requiring re-authentication with current credentials.
- **Address Book**: Manage multiple shipping addresses with a clean form-based interface.

### 8. UI Development & Theme
- **Storybook**: Component library developed in isolation with interactive stories.
- **Theme Persistence**: Saves selected theme (Ocean, Forest, Default) to LocalStorage.
- **Redesigned Dashboard**: Modern grid layout with feature-specific icons.
- **User Greeting**: Interactive "Hi, User" greeting with dropdown functionality.

## tech stack
- **core**: react 19, typescript, vite
- **state management**: redux toolkit, rtk query, context api
- **error handling**: sentry sdk
- **validation**: zod, typebox
- **testing**: vitest, react testing library
- **ui/docs**: storybook 8
- **styling**: css modules + theme variables
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
