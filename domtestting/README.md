
# dom testing with vanilla javascript and jest

this project demonstrates how to test dom manipulation logic using vanilla javascript with jest and jsdom. it focuses on validating user interactions and dynamic dom updates without using a real browser.

---

## objectives

- understand how jsdom simulates browser dom in node
- learn how to test event listeners
- verify dynamic dom updates using jest assertions
- practice unit testing for ui-related logic
- separate application logic and test logic clearly

---

## project structure

```

domtestting/
├── counter.js
├── counter.test.js
├── todo.js
├── todo.test.js
├── form.js
├── form.test.js
├── modal.js
├── modal.test.js
├── index.html
├── jest.config.js
├── package.json
└── README.md

````

---

## features implemented

### 1. counter increment testing

**files:** `counter.js`, `counter.test.js`

- button click increments number displayed
- tests simulate click event using jsdom
- validates text content update

**concepts:**
- addEventListener
- click event simulation
- textContent validation

---

### 2. todo list dom testing

**files:** `todo.js`, `todo.test.js`

- input field adds new list items dynamically
- prevents empty task submission
- tests creation of `<li>` elements

**concepts:**
- createElement
- appendChild
- input value validation

---

### 3. form submission validation

**files:** `form.js`, `form.test.js`

- prevents default submit behavior
- checks if username and password are provided
- sets custom attribute for validation result

**concepts:**
- submit event
- preventDefault
- attribute manipulation

---

### 4. modal toggle logic

**files:** `modal.js`, `modal.test.js`

- toggles css class for modal visibility
- verifies classList changes in test

**concepts:**
- classList.toggle
- visibility state testing

---

## how tests work

- jest runs in node environment
- jsdom creates a fake browser dom
- html is injected using `document.body.innerHTML`
- events are triggered using `.click()` or `dispatchEvent()`
- assertions verify dom state after interactions

no real browser is required.

---

## how to run the project

1. install dependencies

```bash
npm install
````

2. run all tests

```bash
npm test
```

or

```bash
npx jest
```

---

## what i learned

* how dom can be tested without browser ui
* how to simulate user interactions programmatically
* how to validate dynamic html changes
* how to separate ui logic and test cases
* how jest and jsdom work together for frontend testing

---

## summary

* dom testing ensures ui logic works correctly
* jsdom allows browser-like testing in node
* unit testing prevents ui regressions
* event-driven code can be validated using jest
* this forms the foundation for testing frameworks like react testing library

---

