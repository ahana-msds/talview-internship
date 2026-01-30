/**
 * entry point for the node.js application.
 * separates server listening logic from app configuration for better testing.
 */
const app = require('./app');

// port configuration (default to 3000)
const PORT = process.env.PORT || 3000;

// start the server
const server = app.listen(PORT, () => {
  console.log(`
server is flying on port ${PORT}
local: http://localhost:${PORT}
base api: http://localhost:${PORT}/api/users
stream demo: http://localhost:${PORT}/api/stream-demo
`);
});

// handle unexpected errors
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
