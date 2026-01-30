const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 2. express.js routing: mapping urls to controller methods

// GET /api/users - get all users (supports ?role= query)
router.get('/', (req, res) => userController.getUsers(req, res));

// GET /api/users/:id - get user by id (demonstrates route param)
router.get('/:id', (req, res) => userController.getUserById(req, res));

// POST /api/users - create a new user (demonstrates request body)
router.post('/', (req, res) => userController.createUser(req, res));

module.exports = router;
