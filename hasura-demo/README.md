# Hasura & React Todo Demo

A full-stack demonstration of **Hasura GraphQL Engine** integrated with a **React + TypeScript** frontend using **Apollo Client**. This project showcases how to rapidly build GraphQL APIs on top of PostgreSQL and consume them in a modern web application.

## Project Architecture

- **Backend**:
  - **PostgreSQL**: Relational database for storage.
  - **Hasura GraphQL Engine**: Automatically generates a real-time GraphQL API from the database schema.
  - **Docker**: Containerization for easy setup of the database and engine.
- **Frontend**:
  - **React (Vite)**: modern frontend framework.
  - **Apollo Client**: Manages GraphQL queries, mutations, and local state.
  - **TypeScript**: Ensures type safety across the frontend.

## Features

- **GraphQL Queries**: Fetching real-time todo lists.
- **GraphQL Mutations**: Adding new todos to the database.
- **Authentication Simulation**: A simple UI to simulate user login (Admin/User roles).
- **Relational Data**: Demonstrates foreign key relationships between `users` and `todos`.

## Setup & Running the Project

### 1. Requirements
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (for the frontend)

### 2. Launch Backend (Hasura & Postgres)
Navigate to the root of the project and start the containers:
```bash
cd hasura-demo
docker-compose up -d
```
The **Hasura Console** will be available at [http://localhost:8080/console](http://localhost:8080/console) (Admin Secret: `myadminsecretkey`).

### 3. Database Initialization
The `init.sql` script creates the following tables:
- `users`: ID, username, role, timestamps.
- `todos`: ID, title, completion status, user_id (FK), visibility.

> [!IMPORTANT]
> You must **Track** these tables in the Hasura Console (Data tab) to make them available via GraphQL.

### 4. Launch Frontend
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

## Project Structure
- `docker-compose.yml`: Infrastructure configuration.
- `init.sql`: Database schema and seed data.
- `frontend/`:
  - `src/apollo/client.ts`: Apollo Client setup connecting to `localhost:8080`.
  - `src/components/AddTodo.tsx`: GraphQL mutation example.
  - `src/components/TodoList.tsx`: GraphQL query example.
  - `src/components/Auth.tsx`: simple Authentication UI.
