# database mastery: knex.js vs prisma

this project demonstrates internship-level database management in node.js, comparing two popular approaches:
1. **knex.js**: a sql query builder.
2. **prisma**: a modern object-relational mapper (orm).

## structure

- `knex-demo/`: implementation using knex (manual migrations, query building).
- `prisma-demo/`: implementation using prisma (schema-first, type-safe client).

## setup

14: prerequisites: a postgresql database running locally.
15: 
16: ### running with docker
17: 
18: 1. start postgres and create databases automatically:
19:    ```bash
20:    docker-compose up -d
21:    ```
22: 2. the `.env` files are already configured to connect to this container.
23: 
24: 1. create a `.env` file in the root `database-practice` folder with your postgres connection string:
   ```
   database_url="postgresql://user:password@localhost:5432/your_db_name"
   ```

2. copy this `.env` to both subdirectories.

### running knex demo

1. navigate to `knex-demo`:
   ```bash
   cd knex-demo
   npm install
   ```
2. run migrations:
   ```bash
   npx knex migrate:latest
   ```
3. run the demo script:
   ```bash
   node index.js
   ```

### running prisma demo

1. navigate to `prisma-demo`:
   ```bash
   cd prisma-demo
   npm install
   ```
2. push schema to database:
   ```bash
   npx prisma db push
   ```
3. run the demo script:
   ```bash
   node index.js
   ```

## key concepts demonstrated
- **setting up connections**: managing db clients.
- **migrations**: schema management (imperative vs declarative).
- **crud**: create, read, update, delete operations.
- **relationships**: handling one-to-one and one-to-many.
- **transactions**: ensuring data integrity across multiple operations.
