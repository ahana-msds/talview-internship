# advanced graphql practice

this project is a comprehensive **project management dashboard** designed to demonstrate graphql concepts using apollo server and apollo client.

## project structure
- **backend/**: node.js + apollo server v4 + typescript
- **frontend/**: react + vite + apollo client + vanilla css

## key concepts covered

### 1. complex schema design
- **enums**: implementation of `status` (todo, in_progress, done) and `priority` (low, medium, high) to enforce strict data typing
- **nested relationships**: modeling real-world data where:
  - a user has many projects
  - a project has many tasks
  - a task belongs to a project and has an optional assignee (user)

### 2. advanced queries and mutations
- **fragments**: reusable selection sets in `frontend/src/graphql/fragments.ts` to keep queries dry and maintainable
- **nested resolvers**: field-level resolvers in the backend that automatically handle relationship fetching while avoiding n+1 query issues in simple use cases
- **filtering and searching**: query arguments to filter tasks by status or priority and search projects by name or description

## how to run

### 1. start the backend
navigate to the backend directory, install dependencies, and start the server:
```bash
cd graphql-practice/backend
npm install
npm start
````

### 2. start the frontend

navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd graphql-practice/frontend
npm install
npm run dev
```

## key files to review

| component | file path                     | description                                              |
| --------- | ----------------------------- | -------------------------------------------------------- |
| backend   | backend/src/schema.ts         | type definitions (sdl) and enums                         |
| backend   | backend/src/resolvers.ts      | logic for queries, mutations, and nested field resolvers |
| frontend  | frontend/src/apollo/client.ts | apollo client setup and cache policies                   |
| frontend  | frontend/src/graphql/         | graphql queries, mutations, and fragments                |
| frontend  | frontend/src/app.tsx          | main dashboard ui and state management                   |

## learning outcomes

* design scalable graphql schemas using enums and relationships
* write clean, reusable queries using fragments
* implement nested resolvers for real-world data models
* connect a react frontend to a graphql backend using apollo client


```
