Advanced React Patterns: SSR, A11y, and Sagas
This project demonstrates internship-level proficiency in Server-Side Rendering, Accessibility, and advanced Redux Saga logic.

Project Structure
/advanced-patterns
├── server/
│   └── index.js         # Express SSR Server (Vite Integration)
├── src/
│   ├── components/
│   │   └── A11yComponent.jsx # ARIA/Focus Demo
│   ├── store/
│   │   ├── index.js     # Redux + Saga Setup
│   │   ├── userSlice.js # Complex Selectors
│   │   └── sagas.js     # Throttle Effect Demo
│   ├── App.jsx          # Main UI Integration
│   ├── entry-server.jsx # SSR React Entry
│   └── main.jsx         # Client React Entry
├── index.html           # SSR Template
└── package.json         # Scripts and Dependencies
Key Implementations
1. Server-Side Rendering (SSR)
The Server: 

server/index.js
 uses Vite in middleware mode to pre-render the app.
The Flow: When you request the page, Express calls 

render()
 from 

entry-server.jsx
, gets the HTML string, and injects it into the template.
2. Accessibility (A11y) Standards
Semantic HTML: We use <main>, <section>, and <header> to provide structure.
ARIA Labels: In 

A11yComponent.jsx
, we use aria-expanded and aria-controls to describe dynamic states to screen readers.
Focus Management: We demonstrate how to programmatically return focus to the trigger button using useRef.
3. Redux Saga: Throttle & Select
Throttle Effect: In 

sagas.js
, the USER_SCROLLED event is throttled to once every 2 seconds, preventing performance degradation from rapid clicks.
Select Pattern: Inside the saga, we use yield select(selector) to pull the current state, allowing logic to depend on existing data without passing it through actions.
How to Run
Step 1: Install Dependencies
cd advanced-patterns && npm install
Step 2: Start the SSR Server
npm run start:server
The server will run at http://localhost:3002

Verification Steps
SSR Check: Right-click the page and "View Page Source". You will see the full HTML content ready (not just an empty root div).
A11y Check: Use the TAB key to navigate. Notice the focus indicators and how the component handles expansion.
Saga Check: Click the "Simulate Scroll" button rapidly. Notice that the activity list only updates every 2 seconds due to the Throttle effect.