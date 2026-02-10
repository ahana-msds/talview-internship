# SQL Practice: Order Management System

This project is a hands-on practice environment for mastering SQL concepts including Data Definition Language (DDL), Data Manipulation Language (DML), and Database Normalization (3NF).

## Scenario
We are building a simplified **Order Management System** that tracks Customers, Products, Orders, and Order Items.

## Concepts Covered

### Chapter 1: Data Definition Language (DDL)
- **Schema Design**: Creating a relational schema.
- **Normalization**: Ensuring the database is in **3rd Normal Form (3NF)** to reduce redundancy.
- **Data Types**: Using `VARCHAR`, `INTEGER`, `DECIMAL`, `BOOLEAN`, `TIMESTAMP`.
- **Constraints**:
    - `PRIMARY KEY`: Uniquely identifies rows.
    - `FOREIGN KEY`: Enforces relationships between tables.
    - `UNIQUE`: Ensures email addresses are unique.
    - `NOT NULL`: Ensures critical data is always present.
    - `CHECK`: Validates data (e.g., price >= 0, status in specific values).
- **Indexes**: Created on frequently searched columns like `customer_id` and product `name` for performance.

### Chapter 2: Data Manipulation Language (DML)
- **INSERT**: Adding new records to tables.
- **Bulk Insert**: Inserting multiple rows in a single statement.
- **SELECT**: Retrieving data with filtering (`WHERE`).
- **JOINS**:
    - `INNER JOIN`: Matching records in both tables.
    - `LEFT JOIN`: All records from left table, matching from right.
- **SUBQUERIES**: Nested queries for complex filtering.
- **UPDATE**: Modifying existing data based on conditions.
- **DELETE**: Removing records (and cascading deletes).
- **VIEWS**: Creating virtual tables for simplified reporting.

## Project Structure
```
sql-mastery/
├── docker-compose.yml       # PostgreSQL container configuration
├── README.md                # This documentation
└── scripts/
    ├── 01_schema.sql        # DDL: Create tables, constraints, indexes
    ├── 02_seed.sql          # DML: Insert sample data
    ├── 03_queries.sql       # DML: Practice selects, updates, deletes
```

## How to Run

### 1. Start PostgreSQL
Ensure you have Docker installed and run:
```bash
docker-compose up -d
```

### 2. Connect to the Database
You can use any SQL client (like DBeaver, pgAdmin) or the command line.
**Credentials:**
- **Host**: `localhost` (Port 5433)
- **User**: `user`
- **Password**: `password`
- **Database**: `order_management`

### 3. Run the Scripts
Execute the SQL files in order:
1.  **Run `01_schema.sql`**: Creates the tables and structure.
2.  **Run `02_seed.sql`**: Populates the database with initial data.
3.  **Run `03_queries.sql`**: Executes practice queries and modifications.

### 4. Clean Up
To stop and remove the container:
```bash
docker-compose down
```
