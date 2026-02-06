# Redux-Rev: Practicing State Management

This project is a comprehensive guide and practice implementation for **Redux Toolkit (RTK)** and **RTK Query** in a modern React application. It demonstrates how to handle both **Client State** (UI preferences) and **Server State** (API data) efficiently and scalably.

## Key Features

- **Redux Toolkit**: Simplified state management using slices ($uiSlice$).
- **RTK Query**: Automatic data fetching, caching, and invalidation using JSONPlaceholder API.
- **Theme Management**: Dark/Light mode implementation using client-side Redux state.
- **Glassmorphism UI**: Premium visual design with smooth transitions and micro-animations ($framer-motion$).
- **Responsive Layout**: Sidebar navigation and grid-based content.

## Project Structure

```bash
redux-rev/
├── src/
│   ├── app/            # Store configuration
│   ├── features/       # Client-side state (UI, Auth, etc.)
│   ├── services/       # RTK Query API definitions
│   ├── components/     # Reusable UI components
│   ├── App.jsx         # Main layout and logic
│   └── index.css       # Global styles and design system
```

## Core Concepts Demonstrated

### 1. RTK Query ($postsApi.js$)
- **Base Query**: Centralized API configuration.
- **Endpoints**: Defined using $builder.query$ for fetching and $builder.mutation$ for updates.
- **Tagging & Invalidation**: Automatically refreshing the post list after adding or deleting a post.

### 2. Client State ($uiSlice.js$)
- Managing UI-only state like dark mode and sidebar visibility.
- Using $useSelector$ and $useDispatch$ for component interaction.

### 3. Caching & Persistence
- RTK Query automatically caches responses based on query parameters (e.g., limit).
- Demonstrates "Loading" skeletons and "Error" handling out of the box.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```

