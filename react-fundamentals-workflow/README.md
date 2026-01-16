
# react fundamentals workflow (vite + typescript)

this folder contains a self-contained react learning workspace created as part of my internship practice under the talview-internship repository.

the purpose of this workflow is to practice and understand core react concepts using modular, scenario-based examples, without modifying or impacting the main repository setup.

this folder is implemented as an independent vite + react + typescript wrapper application.

---

## tech stack

- react (functional components)
- typescript
- vite (development server and bundler)
- axios (rest api integration)
- vitest (unit testing)
- react testing library
- jsdom (browser environment simulation)

---

## folder structure

```

react-fundamentals-workflow/
├── src/
│   ├── demos/
│   │   ├── hooks-demo/
│   │   │   ├── app.tsx
│   │   │   └── counter.tsx
│   │   │
│   │   ├── rest-api-demo/
│   │   │   ├── app.tsx
│   │   │   ├── api.ts
│   │   │   └── users.tsx
│   │   │
│   │   ├── memo-demo/
│   │   │   ├── app.tsx
│   │   │   └── expensivechild.tsx
│   │   │
│   │   └── unit-test-demo/
│   │       ├── button.tsx
│   │       └── button.test.tsx
│   │
│   ├── app.tsx
│   ├── main.tsx
│   └── setuptests.ts
│
├── index.html
├── package.json
├── vite.config.ts
└── readme.md

````

---

## concepts covered

### core react hooks (hooks-demo)

concepts:
- usestate
- useeffect
- functional component structure

scenario:
a simple counter component that manages state and logs updates using react hooks.

---

### rest api integration (rest-api-demo)

concepts:
- axios configuration
- separation of api logic
- data fetching using useeffect
- type-safe api responses

scenario:
fetching and displaying a list of users from a public rest api.

---

### performance optimization (memo-demo)

concepts:
- react.memo
- preventing unnecessary re-renders
- understanding component render behavior

scenario:
an expensive child component that should only re-render when its props change.

---

### unit testing (unit-test-demo)

concepts:
- component rendering tests
- event simulation
- mock functions using vi.fn()
- vitest with react testing library

scenario:
testing whether a button renders correctly and responds to a click event.

---

## how to run the project

from inside the react-fundamentals-workflow folder:

start the development server:
```bash
npm run dev
````

run unit tests:

```bash
npm test
```

vitest will automatically detect and run all test files.

---

## switching between demos

edit src/app.tsx and import the required demo:

```tsx
import hooksdemo from "./demos/hooks-demo/app";
// import restapidemo from "./demos/rest-api-demo/app";
// import memodemo from "./demos/memo-demo/app";

export default function app() {
  return <hooksdemo />;
}
```

only one demo is rendered at a time to keep learning focused and isolated.

---

## testing setup notes

* vitest is used instead of jest, as it is recommended for vite projects
* jsdom provides a simulated browser environment for component testing
* setuptests.ts enables extended dom assertions

important difference from jest:

```ts
vi.fn() // used instead of jest.fn()
```

---

## design rationale

* keeps learning code isolated from the main repository
* avoids unnecessary changes to existing internship work
* follows modular and scalable frontend structure
* easy to explain during reviews and interviews
* allows adding more demos in the future without refactoring

---

## summary

this workflow demonstrates:

* core react fundamentals
* modern react tooling
* clean project organization
* practical unit testing setup
* professional git and project hygiene

this folder serves as both a learning reference and a portfolio-ready implementation.

