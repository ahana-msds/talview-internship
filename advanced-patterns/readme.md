# Advanced React Patterns: SSR, A11y, and Sagas

this project demonstrates **Server-Side Rendering (SSR)**, **Accessibility (A11y)**, and **Advanced Redux Saga logic**.

---

## project structure

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

## key implementations

### 1. server-side rendering (SSR)
*   **the server**: `server/index.js` utilizes Vite in middleware mode to pre-render the application on the server.
*   **the flow**: when a request is received, Express calls the `render()` function in `entry-server.jsx` to generate the HTML string, which is then injected into the `index.html` template before being sent to the client.

### 2. accessibility (A11y) standards
*   **semantic HTML**: proper use of `<main>`, `<section>`, and `<header>` tags to provide a meaningful document structure.
*   **ARIA attributes**: `A11yComponent.jsx` uses `aria-expanded` and `aria-controls` to communicate dynamic UI states to screen readers.
*   **focus management**: demonstrates professional programmatic focus control (e.g., returning focus to a trigger button) using React `useRef`.

### 3. redux saga: throttle & select
*   **throttle effect**: in `sagas.js`, the `USER_SCROLLED` event is throttled to execute at most once every 2 seconds, preventing performance issues from high-frequency user actions.
*   **select pattern**: uses the `yield select(selector)` effect inside sagas to pull current state data, allowing business logic to be decoupled from action payloads.

---

## how to Run

### step 1: install dependencies
```bash
cd advanced-patterns
npm install
```

### step 2: start the SSR server
```bash
npm run start:server
```
*the server will run at **http://localhost:3002***

---

## verification Steps
1.  **SSR check**: right-click the page and select "View Page Source". You will see the full pre-rendered HTML content instead of an empty `<div id="root">`.
2.  **A11y check**: navigate the app using only the **TAB** key. Observe the focus indicators and how focus is managed when components expand or close.
3.  **saga check**: click the "Simulate Scroll" button rapidly. Observe the activity list and notice that it only updates once every 2 seconds due to the **Throttle** effect.
