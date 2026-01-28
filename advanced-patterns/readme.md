# Advanced React Patterns: SSR, A11y, and Sagas

This project demonstrates internship-level proficiency in **Server-Side Rendering (SSR)**, **Accessibility (A11y)**, and **Advanced Redux Saga logic**.

---

## Project Structure

```text
/advanced-patterns
├── server/
│   └── index.js          # Express SSR Server (Vite Integration)
├── src/
│   ├── components/
│   │   └── A11yComponent.jsx # ARIA/Focus Management Demo
│   ├── store/
│   │   ├── index.js      # Redux Toolkit + Saga Setup
│   │   ├── userSlice.js  # Complex State & Selectors
│   │   └── sagas.js      # Throttle Effect Implementation
│   ├── App.jsx           # Main UI Integration
│   ├── entry-server.jsx  # SSR React Rendering Entry
│   └── main.jsx          # Client-side Hydration Entry
├── index.html            # SSR HTML Template
└── package.json          # Scripts and Dependencies
```

---

## Key Implementations

### 1. Server-Side Rendering (SSR)
*   **The Server**: `server/index.js` utilizes Vite in middleware mode to pre-render the application on the server.
*   **The Flow**: When a request is received, Express calls the `render()` function in `entry-server.jsx` to generate the HTML string, which is then injected into the `index.html` template before being sent to the client.

### 2. Accessibility (A11y) Standards
*   **Semantic HTML**: Proper use of `<main>`, `<section>`, and `<header>` tags to provide a meaningful document structure.
*   **ARIA Attributes**: `A11yComponent.jsx` uses `aria-expanded` and `aria-controls` to communicate dynamic UI states to screen readers.
*   **Focus Management**: Demonstrates professional programmatic focus control (e.g., returning focus to a trigger button) using React `useRef`.

### 3. Redux Saga: Throttle & Select
*   **Throttle Effect**: In `sagas.js`, the `USER_SCROLLED` event is throttled to execute at most once every 2 seconds, preventing performance issues from high-frequency user actions.
*   **Select Pattern**: Uses the `yield select(selector)` effect inside sagas to pull current state data, allowing business logic to be decoupled from action payloads.

---

## How to Run

### Step 1: Install Dependencies
```bash
cd advanced-patterns
npm install
```

### Step 2: Start the SSR Server
```bash
npm run start:server
```
*The server will run at **http://localhost:3002***

---

## Verification Steps
1.  **SSR Check**: Right-click the page and select "View Page Source". You will see the full pre-rendered HTML content instead of an empty `<div id="root">`.
2.  **A11y Check**: Navigate the app using only the **TAB** key. Observe the focus indicators and how focus is managed when components expand or close.
3.  **Saga Check**: Click the "Simulate Scroll" button rapidly. Observe the activity list and notice that it only updates once every 2 seconds due to the **Throttle** effect.
