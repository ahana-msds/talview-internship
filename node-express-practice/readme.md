# node-express-practice

this project demonstrates core node.js and express.js concepts . it follows a  structure using routes, controllers, and services for better scalability.

## concepts covered
- get and post routes
- route parameters and query strings
- request bodies and json parsing
- node.js core modules: http, fs, path, stream
- asynchronous programming: async/await and promises
- custom and built-in middleware
- project architecture for scalability

## project structure
- src/app.js: express configuration and middleware
- src/server.js: entry point for the server
- src/routes/: route definitions
- src/controllers/: request/response handling logic
- src/services/: business logic and data access
- src/middleware/: custom logic applied before route handlers
- src/data/: local json storage for demonstration
- src/utils/: helper utilities including stream demo

## how to run
1. install dependencies:
npm install

2. start the server:
node src/server.js

3. test endpoints:
- get all users: http://localhost:3000/api/users
- get admin users: http://localhost:3000/api/users?role=admin
- get specific user: http://localhost:3000/api/users/1
- post new user: use postman or curl to post to http://localhost:3000/api/users with json body
- stream demo: http://localhost:3000/api/stream-demo

## curl examples
- create user:
curl -x post http://localhost:3000/api/users -h "content-type: application/json" -d '{"name": "new", "email": "new@example.com", "role": "user"}'
