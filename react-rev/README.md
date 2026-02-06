# React Revision 

This project demonstrates the core concepts of React 

## Concepts Covered

### 1. Components
- **Functional Components**: Modern way to define components using functions and hooks.
- **Class Components**: Traditional way using ES6 classes and `React.Component`.

### 2. Props vs State
- **Props**: Immutable data passed from parent to child.
- **State**: Mutable data managed internally within a component.

### 3. Using Props
- Passing data through attributes.
- Accessing props in functional components (via arguments) and class components (via `this.props`).

### 4. Managing State
- Using the `useState` hook.
- Updating state and understanding re-renders.

### 5. Event Handling 
- **Synthetic Events**: React's cross-browser event wrapper.
- **Handlers**: Functions that respond to UI interactions (onClick, onMouseEnter, etc.).
- **Bubbling & Capturing**: Understanding the two phases of event propagation.
- **preventDefault**: Stopping default browser behaviors.

### 6. React Hooks (Advanced)
- **useState**: Functional state management.
- **Direct DOM & Values**: Using `useRef` correctly.
- **Context API**: Global state management.

### 7. Forms and Controlled Components
- **Controlled vs Uncontrolled**: Managing input state via React vs DOM.
- **Form Handling**: Capturing input, select, and checkbox data.
- **Validation**: Implementing client-side validation logic.

### 8. React Router
- **Navigation**: Using Link and Routes for SPAs.
- **Dynamic Routes**: Handling URL parameters with `:id`.
- **Protected Routes**: Restricting access based on authentication status.

### 9. Debugging and Error Boundaries
- **React DevTools**: Inspecting components and profiling performance.
- **Debugging Techniques**: Using `debugger`, console logs, and breakpoints.
- **Error Boundaries**: Catching JavaScript errors in components using `componentDidCatch`.

### 10. API Integration
- **REST**: Using the native `fetch` API, handling loading/error states, and async/await.
- **GraphQL**: Understanding the query structure and fetching data via POST requests.

### 11. Unit Testing
- **Vitest & Jest**: Writing assertions using `describe`, `it`, and `expect`.
- **Quality & Coverage**: Best practices for writing determinisitic and isolated tests.
- **Commands**: Running tests with `npm test`.

---

## How to Run

1. **Navigate to the folder**:
   ```bash
   cd react-rev
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: Open the link provided in the terminal (usually `http://localhost:5173`).

---

## Code Walkthrough

- `src/components/BasicComponents/`: Contains Functional vs Class component demos.
- `src/components/StateAndProps/`: Demonstrates data flow and local state.
- `src/components/EventHandling/`: Covers the Synthetic Event system and propagation.
- Every file contains extensive comments explaining each line of code.
