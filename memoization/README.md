
# memoization in react (usememo, usecallback, react.memo)

this mini project demonstrates how memoization works in react and how it helps improve performance by preventing unnecessary recalculations and re-renders.

the project is built using react + typescript with vite.

---

## learning objectives

this project helps understand:

- why react components re-render
- what memoization means in react
- how to memoize expensive calculations using usememo
- how to memoize function references using usecallback
- how to prevent unnecessary child component renders using react.memo
- how component re-rendering is related to state changes

---

## concepts used

| concept      | purpose |
|-------------|--------|
| usestate     | manages component state |
| usememo      | caches expensive calculation results |
| usecallback  | keeps function reference stable |
| react.memo   | prevents child re-render when props do not change |
| props        | passes data from parent to child |
| component    | reusable ui building blocks |

---

## project behavior

the app contains:

- a counter (count state)
- an input field (text state)
- an expensive calculation based on count
- a child button component
- a student display component

### expected behavior

- typing in input should not trigger slow calculation
- clicking increase count should trigger slow calculation
- student component should not re-render unless its props change
- button component should not re-render due to usecallback

console logs are used to observe rendering behavior.

---

## file structure

```

memoization/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   └── student.tsx
│   ├── app.tsx
│   └── main.tsx
├── index.html
├── package.json
└── tsconfig.json

````

---

## how memoization works in this project

### usememo

used to cache result of slow calculation.

```ts
const result = useMemo(() => slowCalculation(count), [count]);
````

this ensures calculation runs only when count changes.

---

### usecallback

used to prevent function recreation on each render.

```ts
const handleClick = useCallback(() => {
  console.log("child button clicked");
}, []);
```

this prevents child component from re-rendering due to new function reference.

---

### react.memo

used to prevent re-render of student component.

```ts
export default React.memo(Student);
```

react performs shallow comparison of props and skips render if unchanged.

---

## how to run locally

inside memoization folder:

```bash
npm install
npm run dev
```

open browser at the shown localhost url.

---

## why memoization is important

without memoization:

* heavy calculations run on every render
* child components re-render unnecessarily
* performance degrades for large applications

with memoization:

* only required work is performed
* ui remains responsive
* components scale better

memoization is an optimization tool and should be used only when needed.

---



just say: **next project: useeffect** and we continue 💙
```
