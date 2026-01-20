
# redux & saga design patterns

this project demonstrates how **redux** and **redux-saga** are used together in a react application to handle **global state management** and **complex asynchronous logic** in a clean, predictable, and scalable way.

the focus of this chapter is on understanding **why sagas exist**, how they differ from traditional async handling, and how to structure real-world redux applications.

---

##  concepts covered 

1. redux fundamentals  
   - actions and action types  
   - reducers and immutable state updates  
   - store creation  

2. introduction to redux-saga  
   - why sagas are used for side effects  
   - generator functions and `yield`  

3. saga effects  
   - `takeEvery` for listening to actions  
   - `call` for async functions  
   - `put` for dispatching actions  

4. handling asynchronous flows  
   - separating api logic from components  
   - centralized async control  

5. error handling  
   - using `try/catch` inside sagas  

6. advanced saga concepts (introduced)  
   - `all` for running multiple sagas  
   - conceptual understanding of `race`, `cancel`, `select`, and `throttle`  

7. best practices  
   - thin components  
   - pure reducers  
   - domain-based saga organization  

---

## learning scenario

the app simulates a **user data fetch flow**:

- a user clicks a button
- an action is dispatched
- a saga intercepts the action
- an api call is executed
- the redux store is updated
- the ui re-renders automatically

this mirrors how real production applications handle async workflows.

---

## project structure

```

chapter-14-redux-saga/
│
├── src/
│   ├── redux/
│   │   ├── actions.js
│   │   ├── reducer.js
│   │   └── store.js
│   │
│   ├── sagas/
│   │   ├── userSaga.js
│   │   └── rootSaga.js
│   │
│   ├── components/
│   │   └── UserFetcher.js
│   │
│   ├── App.js
│   └── index.js
│
└── package.json

```

---

## file-by-file explanation

### `index.js`
- entry point of the react application
- creates the react root
- wraps the app with `Provider`
- injects the redux store into react
- enables redux hooks across the application

---

### `App.js`
- top-level application component
- responsible for layout and structure
- renders feature-level components
- contains no redux or saga logic

---

## redux folder

### `actions.js`
- defines action types
- defines action creators
- represents **events** in the application
- does not contain business logic

---

### `reducer.js`
- defines initial application state
- listens for dispatched actions
- updates state immutably
- must remain a pure function

---

### `store.js`
- creates redux store
- configures saga middleware
- runs the root saga
- acts as the central state container

---

## sagas folder

### `userSaga.js`
- listens for specific redux actions
- handles asynchronous logic
- performs api calls using `call`
- dispatches results using `put`
- wraps async logic in `try/catch`

---

### `rootSaga.js`
- combines multiple sagas
- uses `all` effect to run sagas in parallel
- provides a single saga entry point

---

## components folder

### `UserFetcher.js`
- react component connected to redux
- dispatches actions using `useDispatch`
- reads state using `useSelector`
- does not perform api calls directly
- re-renders automatically when state changes

---

## data flow overview

```

ui interaction
↓
redux action dispatched
↓
saga intercepts action
↓
async api call
↓
success action dispatched
↓
reducer updates store
↓
ui re-renders

````

---

## how to run the project

```bash
npm install
npm start
````

open the browser at `http://localhost:3000`

---

## key takeaways 

* sagas provide a clean way to handle side effects
* redux enforces predictable state updates
* components remain simple and declarative
* async logic is centralized and testable
* large applications benefit from saga-based architecture

---

