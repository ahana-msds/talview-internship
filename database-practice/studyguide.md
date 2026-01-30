# database concept mastery: knex.js vs prisma

this guide explains the core concepts used in this project, designed to help you answer internship-level questions confidently.

## 1. fundamental concepts

### what is an orm (object-relational mapper)?
an orm (like **prisma**, sequelize, typeorm) is a library that maps database tables to object-oriented classes (or models) in your code.
- **pro**: you write code in your language (javascript/typescript) instead of sql. handling relationships is easy (e.g., `user.posts`).
- **con**: can hide performance issues (n+1 problem); less control over exact queries.

### what is a query builder?
a query builder (like **knex.js**) provides a programmable interface to construct sql queries. it sits between raw sql and an orm.
- **pro**: closer to sql, giving you more control and performance tuning capability. no "magic" happening behind the scenes.
- **con**: you have to handle relationships (joins) and data formatting manually.

---

## 2. architecture & workflow

### knex.js workflow (imperative)
1. **migrations**: you write javascript files to tell the db how to change (create table, drop table).
2. **seeds**: you populate initial data.
3. **queries**: you chain methods like `.select()`, `.where()`, `.join()`.
   ```js
   // code example from project
   db('users').where({ id: 1 }).first();
   ```

### prisma workflow (declarative)
1. **schema.prisma**: you define the *final state* of your data models in one file.
2. **generation**: prisma reads the schema and generates a custom client (`node_modules/.prisma/client`) with types tailored to your schema.
3. **queries**: you use the generated client methods.
   ```js
   // code example from project
   prisma.user.findUnique({ where: { id: 1 } });
   ```

---

## 3. key operations comparison

| operation | knex.js (query builder) | prisma (orm) |
|-----------|-------------------------|--------------|
| **create** | `db('users').insert(data)` | `prisma.user.create({ data })` |
| **read** | `db('users').select('*')` | `prisma.user.findMany()` |
| **join/relation** | `.leftJoin('posts', 'u.id', 'p.uid')` | `include: { posts: true }` |
| **migrations** | manual up/down functions | `prisma migrate` / `db push` auto-generates |

## 4. internship interview questions & answers

**q: why would you choose knex over prisma?**
a: "i would choose knex if i needed raw performance and precise control over my sql queries, or if the project has a legacy database schema that doesn't map cleanly to prisma's strict models."

**q: what is a transaction and why did we use it?**
a: "a transaction ensures that a group of database operations either all succeed or all fail. in our project, we used it when creating a user and their profile. if creating the profile fails, we don't want a 'ghost' user left in the database; the transaction rolls back everything."

**q: explain 'migration' in database terms.**
a: "migrations are like version control for your database schema. they allow you to evolve your database structure (adding tables, columns) over time and share those changes with the team."

## 5. how to explain this project
"i built a dual-implementation backend system to master database interactions. i implemented the same user-post-profile architecture using both knex.js (for low-level query building) and prisma (for high-level orm features). i handled complex scenarios like database transactions and one-to-many relationships in both approaches to understand the trade-offs in developer experience versus control."
