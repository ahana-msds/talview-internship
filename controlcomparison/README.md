
# controlled vs uncontrolled components in react (typescript)

this project demonstrates the difference between controlled and uncontrolled form components in react using a simple event registration scenario. it shows how react can manage form inputs using state and how inputs can also be accessed directly from the dom using refs.

---

## project structure

```

src/
├── forms/
│   ├── ControlledRegistration.tsx
│   ├── UncontrolledRegistration.tsx
├── App.tsx
└── index.tsx

````

---

## learning objectives

- understand controlled components using react state
- understand uncontrolled components using refs
- compare form handling approaches in react
- learn when to use each pattern
- practice clean and modular component design

---

## scenario used

event registration form with:

- name input field
- meal preference dropdown
- submit button
- confirmation message after submission

both controlled and uncontrolled versions implement the same ui behavior for easy comparison.

---

## controlled registration component

**file:** `ControlledRegistration.tsx`

### how it works

- input values are stored in react state using `useState`
- every change updates state through `onChange`
- submitted data is displayed using state

### benefits

- easy validation
- predictable data flow
- better suited for complex forms

---

## uncontrolled registration component

**file:** `UncontrolledRegistration.tsx`

### how it works

- input values are stored in the dom
- `useRef` is used to access input values on submit
- no state updates on every keystroke

### benefits

- simpler code for small forms
- fewer re-renders
- useful when integrating non-react ui libraries

---

## app component

**file:** `App.tsx`

- renders both registration forms
- allows side-by-side comparison of behavior
- demonstrates component composition

---

## entry point

**file:** `index.tsx`

- mounts the react application to the dom
- uses `createRoot` and `StrictMode`

---

## how to run the project

### if using vite

```bash
npm install
npm run dev
````

open: [http://localhost:5173](http://localhost:5173)

### if using create react app

```bash
npm install
npm start
```

open: [http://localhost:3000](http://localhost:3000)

---

## key differences summary

| feature         | controlled            | uncontrolled  |
| --------------- | --------------------- | ------------- |
| value source    | react state           | dom           |
| updates         | on every input change | on submit     |
| validation      | easy                  | harder        |
| recommended for | most forms            | simple inputs |

---

## what this project demonstrates

* react hooks (`useState`, `useRef`)
* form submission handling
* controlled input binding
* direct dom access using refs
* clean component separation

---

## summary

this project provides a clear comparison of two important react form-handling techniques. understanding both controlled and uncontrolled components helps in building efficient, maintainable, and scalable user interfaces.

---

