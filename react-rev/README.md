# React Revision Project

This project demonstrates the core concepts of React as requested for Chapters 1-6.

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

### 5. Event Handling (Chapter 6)
- **Synthetic Events**: React's cross-browser event wrapper.
- **Handlers**: Functions that respond to UI interactions (onClick, onMouseEnter, etc.).
- **Bubbling & Capturing**: Understanding the two phases of event propagation.
- **preventDefault**: Stopping default browser behaviors.

### 6. React Hooks (Advanced)
- **useState**: Functional state management.
- **useEffect**: Lifecycle equivalents and side effects.
- **useRef**: Persistent references and DOM interaction.
- **useMemo**: Performance optimization for values.
- **useCallback**: Performance optimization for functions.

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

4. **Open in browser**: 点击 the link provided in the terminal (usually `http://localhost:5173`).

---

## Code Walkthrough

- `src/components/BasicComponents/`: Contains Functional vs Class component demos.
- `src/components/StateAndProps/`: Demonstrates data flow and local state.
- `src/components/EventHandling/`: Covers the Synthetic Event system and propagation.
- Every file contains extensive comments explaining each line of code.
