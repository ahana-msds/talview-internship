const express = require('express');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/userRoutes');
const streamDemo = require('./utils/fileStream');

const app = express();

/**
 * express configuration and middleware setup
 */

// 2. express.js middleware: built-in middleware to parse json bodies
app.use(express.json());

// custom logger middleware
app.use(logger);

// base health check route
app.get('/', (req, res) => {
    res.status(200).send('node/express internship demo api is running');
});

// route for demonstrating streams
app.get('/api/stream-demo', (req, res) => {
    streamDemo.streamUsersToResponse(res);
});

// api routes
app.use('/api/users', userRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'route not found' });
});

module.exports = app;
