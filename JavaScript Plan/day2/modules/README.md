# javascript modules 

this folder contains practice files created to understand how javascript code can be split into multiple files using modules, and how different parts of an application can communicate using export and import.

---

## objectives

- understand what javascript modules are and why they are needed
- learn how to share code using named and default exports
- understand how to import functionality from other files
- practice dynamic imports for loading features only when required

---

## topics covered

- module scope and file-level isolation
- named exports and named imports
- default export and flexible importing
- importing multiple functions from a single file
- dynamic import using the import() function
- separating logic into service, utility, and controller style files

---

## files overview

| file name | purpose |
|----------|--------|
| `scoring.js` | contains evaluation logic such as score generation and grading and exports them as named functions |
| `report.js` | handles formatting of evaluation results and exports report creation logic |
| `logger.js` | provides a default export function for logging system messages |
| `analytics.js` | contains feature code that is loaded using dynamic import when needed |
| `app.js` | main controller file that imports all modules and connects the full workflow |

---

## what i learned by implementing these

- how modules keep code organized and prevent global variable conflicts
- how named and default exports are used in different design situations
- how importing only required functionality improves clarity
- how dynamic imports help optimize performance by loading code only when needed
- how real applications separate services, utilities, and controllers into modules

---

## summary 

- modules allow large applications to be split into manageable files.  
- export and import control how code is shared between files.  
- dynamic imports improve performance by loading features only when needed.  
- modular design is essential for scalable frontend and backend systems.

---
