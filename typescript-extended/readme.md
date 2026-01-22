


# typescript in real projects & frameworks

this repository documents **hands-on implementation of typescript in real-world scenarios**, focusing on how typescript is used in **production-grade projects**, across **testing, deployment, frontend frameworks, and backend services**.

the work is structured into **module 7** and **module 8**, following industry practices and internship-level expectations.

---

# module : typescript in real projects

this module focuses on applying **typescript in real-world project scenarios**, covering how production-grade typescript projects are structured, tested, and prepared for deployment.

---

## building projects with typescript

### objective

to understand how a scalable typescript project is organized using **modules**, how responsibilities are separated across files, and how dependencies are managed in a maintainable way.

---

### project structure

```
ts-real-project/
├── src/
│   ├── models/
│   │   └── user.ts
│   ├── services/
│   │   └── userService.ts
│   ├── utils/
│   │   └── logger.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

this structure follows **industry standards**, separating:

* data models
* business logic
* utilities
* application entry point

---

### configuration

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true
  }
}
```

**explanation**

* `target`: outputs modern javascript compatible with node.js
* `module`: uses commonjs module system for backend compatibility
* `rootDir`: source code location
* `outDir`: compiled production output
* `strict`: enforces strong type safety across the project

---

### source code responsibilities

#### src/models/user.ts

* defines the data structure used across the application
* ensures consistent typing for user-related data
* demonstrates interfaces as **contracts** in large codebases

---

#### src/utils/logger.ts

* reusable utility function
* centralizes logging logic
* demonstrates separation of cross-cutting concerns

---

#### src/services/userService.ts

* contains business logic
* uses typed models and shared utilities
* demonstrates module imports and dependency management
* ensures strict adherence to the `User` interface

---

#### src/index.ts

* application entry point
* orchestrates service calls
* represents how production applications bootstrap logic

---

### how the project runs

* typescript files are compiled into javascript
* runtime execution happens from the `dist` folder
* source and production code remain clearly separated

---

### concepts learned (7.1)

* scalable folder organization
* separation of concerns
* typescript modules using `import` / `export`
* explicit dependency management
* strict typing to prevent runtime errors

---

##  testing typescript code

### objective

to validate application logic using **unit tests written in typescript**, ensuring correctness before deployment.

---

### tools used

* jest
* ts-jest
* @types/jest

---

### testing implementation

#### src/math.ts

* pure function with deterministic output
* designed for easy unit testing

#### src/math.test.ts

* validates correctness of logic
* demonstrates jest test structure
* ensures type-safe test coverage

---

### running tests

```bash
npm install --save-dev jest ts-jest @types/jest
npx ts-jest config:init
npx jest
```

---

### concepts learned 

* writing unit tests in typescript
* testing pure functions
* validating logic before deployment
* integrating jest with typescript projects

---

## deploying typescript applications

### objective

to understand how typescript code is prepared for **production deployment**.

---

### key concepts

* compilation: converting `.ts` to `.js`
* build separation: source vs production output
* type safety as a deployment gate

---

### production build

```bash
npx tsc --build
```

this step:

* performs full type checking
* compiles all source files
* enables incremental builds
* blocks deployment on type errors

---

### overall learnings from module 7

* real-world typescript project structure
* clean module interaction at scale
* importance of testing before deployment
* how typescript fits into production pipelines
* writing maintainable and type-safe code

---

# module: typescript with frameworks & libraries (implementation)

this module focuses on **hands-on implementation of typescript with popular frameworks and libraries**, showing how strong typing is applied consistently across frontend and backend systems.

the emphasis is on **setup, implementation, and execution**, not theory.

---

## typescript with react

### implementation focus

* typed component props
* vite-based modern tooling
* strict compile-time validation

#### highlights

* props explicitly typed using interfaces/types
* invalid component usage caught at compile time
* improved readability and maintainability

---

## typescript with angular (core implementation)

* angular uses typescript by default
* class-based components with typed properties
* demonstrates framework-native type safety

this implementation focuses on the **core component file**, without full CLI setup.

---

## typescript with vue

### implementation focus

* typescript in single-file components
* typed and required props
* composition api usage

#### highlights

* safer component contracts
* improved editor support and refactoring
* consistent typing across components

---

## typescript with node.js

### implementation focus

* backend server using node.js core modules
* strict typescript configuration
* explicit typing for request and response objects

#### highlights

* no default imports from node core modules
* proper use of `IncomingMessage` and `ServerResponse`
* strict mode compliance without using `any`

---

## what was implemented across module 8

* typed react component props
* angular class-based typing
* vue components with typescript props
* node.js server with strict typing
* separate frontend and backend projects
* production-style project layouts

---


## relevance

this work reflects **industry-level typescript practices**, including:

* strong typing discipline
* scalable architecture
* test-first thinking
* deployment readiness
* full-stack typescript usage

---

## summary

these modules together demonstrate the ability to:

* design and structure real-world typescript projects
* apply typescript across frontend and backend stacks
* test, compile, and prepare applications for production
* write clean, maintainable, and type-safe code

---

