
# advanced redux toolkit + saga – user search dashboard

this project demonstrates an **implementation** of **redux toolkit** combined with **redux-saga** to handle **complex, cancellable asynchronous workflows** in a react application.

the focus is not on ui styling, but on **correct architecture, clean separation of concerns, and real-world async patterns** commonly used in production applications.

---

## project scenario

**user search dashboard**

- a user types into a search input
- search requests are dispatched to redux
- sagas handle async logic and cancellation
- loading and error states are managed centrally
- results update automatically in the ui

this simulates a real-world search feature such as:
- employee search
- user directory lookup
- product search

---

## concepts and functionalities covered

- redux toolkit slices for state management
- redux-saga for handling side effects
- generator functions and `yield`
- `takeLatest` for cancelling stale requests
- `race` effect for timeout handling
- global loading and error state handling
- safe, defensive ui rendering
- clean project structure for scalability
- separation of ui, state, and async logic
- saga unit testing using `redux-saga-test-plan`

---

## project structure

```

src/
│
├── app/
│   └── store.js
│
├── features/
│   └── users/
│       ├── userSlice.js
│       ├── userSaga.js
│       ├── userApi.js
│       └── UserSearch.js
│
├── sagas/
│   └── rootSaga.js
│
├── tests/
│   └── userSaga.test.js
│
├── App.js
└── index.js

```

---

## file-by-file explanation

### `index.js`
- application entry point
- creates the react root
- wraps the app with redux `Provider`
- injects the redux store into the component tree

---

### `App.js`
- main application layout component
- renders the user search feature
- contains no business or async logic

---

## app layer

### `app/store.js`
- configures the redux store using redux toolkit
- sets up saga middleware
- disables redux thunk (saga is used instead)
- runs the root saga

---

## users feature (domain-based structure)

### `userSlice.js`
- defines the redux state shape for users
- manages `data`, `loading`, and `error`
- uses redux toolkit reducers for immutable updates
- exposes actions used by sagas

---

### `userSaga.js`
- listens for search actions using `takeLatest`
- cancels previous requests on new input
- performs async api calls
- handles timeout logic using `race`
- dispatches success or failure actions
- logs cancellation for debugging

---

### `userApi.js`
- simulates an api layer
- introduces artificial delay
- throws errors for testing error handling
- keeps data fetching logic separate from sagas

---

### `UserSearch.js`
- react component responsible for ui
- dispatches search actions
- reads global state using `useSelector`
- renders input, loading, error, and results
- remains free of async and api logic

---

## sagas layer

### `rootSaga.js`
- combines all feature sagas
- runs them in parallel using `all`
- provides a single saga entry point

---

## testing

### `userSaga.test.js`
- tests saga behavior in isolation
- mocks api responses
- verifies correct redux actions are dispatched
- demonstrates how async flows can be tested reliably

---

## data flow overview

```

user types input
↓
redux action dispatched
↓
saga intercepts action
↓
loading state updated
↓
api call (with timeout)
↓
success / failure action
↓
redux store updated
↓
ui re-renders automatically

```

---

## what i learned from this project

- how redux toolkit simplifies redux boilerplate
- how redux-saga handles complex async logic cleanly
- how to cancel stale api requests using `takeLatest`
- how to handle timeouts using `race`
- how to manage loading and error states globally
- how to structure feature-based redux projects
- how to avoid putting async logic in components
- how to debug silent rendering issues
- how to write testable sagas

---

## key takeaways

- sagas are ideal for complex async workflows
- ui components should stay simple and declarative
- side effects must be centralized and testable
- clean architecture prevents hidden bugs
- correct folder structure improves scalability

---

## next possible enhancements

- debounce user input
- add pagination support
- integrate real backend api
- add caching using `select`
- migrate to typescript
- implement authentication flow
- compare saga with redux toolkit listener middleware

---

this project represents **production-style redux architecture** 

