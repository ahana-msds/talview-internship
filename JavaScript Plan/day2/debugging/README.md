# debugging and error handling in javascript 

this folder contains practice files created to understand how errors occur in real programs, how to handle them safely using try and catch, and how to debug both synchronous and asynchronous code using browser developer tools.

---

## objectives

- understand how runtime errors occur and how to prevent app crashes
- learn to use try, catch, and finally blocks for safe execution
- create and handle custom error types for better error classification
- practice debugging techniques using logs, breakpoints, and debugger statements
- understand how async errors behave differently from sync errors
- learn how browser devtools help inspect runtime values and control flow

---

## topics covered

- basic error handling using try and catch
- throwing errors using the error object
- custom error classes by extending error
- error handling in async and await functions
- debugging using console logs and debugger keyword
- tracing incorrect values and type issues
- separating business logic errors from system errors
- browser-based debugging with dom events and user input validation

---

## files overview

| file name | concept covered |
|--------|------------------|
| `error.js` | basic try catch usage and throwing errors |
| `customerror.js` | creating and handling custom error classes |
| `debug.js` | debugging logic errors using debugger and console |
| `debugpractice.js` | practice scenarios for tracing incorrect behavior |
| `asyncdebug.js` | handling and debugging errors in async workflows |
| `index.html` | browser ui for testing score validation and triggering debug flow :contentReference[oaicite:0]{index=0} |
| `script.js` | contains try catch logic, debugger statement, and dom updates for error display |

---

## what i learned by implementing these

- how to stop programs from crashing by catching runtime errors
- how meaningful error messages improve user feedback and debugging speed
- how different error types can be handled differently in pipelines
- how debugger pauses execution to inspect variable values step by step
- how async errors must be caught using try catch around await
- how browser devtools help debug event-driven and ui-based code
- how debugging focuses more on fixing wrong logic than syntax errors

---

## summary 

- error handling protects applications from unexpected failures.  
- custom errors help classify problems in complex systems.  
- debugging tools reveal real execution behavior and data flow.  
- testing and debugging together improve software reliability.

---
