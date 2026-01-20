
# advanced react concepts

this project is a learning-focused implementation of **advanced react concepts** using small, modular, and readable components. the goal of this chapter is to understand **how react works internally**, how to **optimize performance**, and how to use **advanced composition patterns** correctly.

the code is written to be **concept-first**, not feature-heavy.

---

## concepts covered

1. performance optimization  
   - shouldcomponentupdate  
   - purecomponent  

2. react context  
   - avoiding prop drilling  
   - sharing global data  

3. refs  
   - direct dom access  
   - focusing inputs  

4. higher-order components (hoc)  
   - reusing logic across components  

5. render props  
   - sharing behavior using functions as props  

6. server-side rendering (conceptual understanding)  
   - understanding what ssr is and why it is used  

7. accessibility  
   - making components usable for screen readers  

---

## learning scenario

the app is structured as a **learning dashboard**, where each component demonstrates **one advanced react concept in isolation**.

the focus is on:
- understanding *why* the pattern exists
- knowing *when* to use it
- seeing *how* it works in real code

---

## project structure

```

advanced-react/
│
├── src/
│   ├── performance/
│   │   ├── ShouldComponentUpdateDemo.js
│   │   └── PureComponentDemo.js
│   │
│   ├── context/
│   │   └── ThemeContextDemo.js
│   │
│   ├── refs/
│   │   └── InputFocusDemo.js
│   │
│   ├── hoc/
│   │   └── withLogger.js
│   │
│   ├── render-props/
│   │   └── MouseTracker.js
│   │
│   ├── ssr/
│   │   └── SSRExplanation.js
│   │
│   ├── accessibility/
│   │   └── AccessibleButton.js
│   │
│   ├── App.js
│   └── index.js
│
└── package.json

````

---

## file-by-file explanation

### `index.js`
- entry point of the react application
- attaches react to the browser dom
- renders only the `<App />` component
- does not contain business logic or ui

---

### `App.js`
- main container component
- imports and renders individual demo components
- used to visually test and understand each concept

---

## performance folder

### `ShouldComponentUpdateDemo.js`
- demonstrates manual control over re-rendering
- uses `shouldComponentUpdate` lifecycle method
- prevents unnecessary renders when props do not change
- useful in large or performance-sensitive components

---

### `PureComponentDemo.js`
- demonstrates automatic performance optimization
- uses shallow comparison of props and state
- acts as a simpler alternative to `shouldComponentUpdate`

---

## context folder

### `ThemeContextDemo.js`
- demonstrates react context api
- shows how to share data globally without prop drilling
- uses `createContext`, `Provider`, and `useContext`

---

## refs folder

### `InputFocusDemo.js`
- demonstrates use of `useRef`
- accesses dom elements directly
- used for focusing input fields or reading values without re-render

---

## hoc folder

### `withLogger.js`
- demonstrates higher-order components
- wraps another component and adds logging behavior
- shows how logic can be reused without modifying the original component

---

## render-props folder

### `MouseTracker.js`
- demonstrates render props pattern
- tracks mouse position internally
- delegates rendering responsibility to parent via a function prop
- separates **behavior** from **presentation**

---

## ssr folder

### `SSRExplanation.js`
- explains the concept of server-side rendering
- clarifies why ssr improves seo and first load performance
- included for conceptual understanding (not actual ssr implementation)

---

##  accessibility folder

### `AccessibleButton.js`
- demonstrates accessibility best practices
- uses aria attributes
- improves usability for screen readers and assistive technologies

---

##  how to run the project

```bash
npm install
npm start
````

the app will run on `http://localhost:3000`

---

## key takeaways f

* performance optimization should be intentional
* logic reuse can be done using hoc or render props
* hooks simplify many older patterns but understanding them is essential
* accessibility is not optional in real-world applications
* architecture decisions affect scalability and maintainability

---

