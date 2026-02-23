const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4002;
const SECRET_KEY = 'super-secret-key';

app.use(cors());
app.use(bodyParser.json());

let todos = [
    { id: 1, text: 'Learn Cypress', completed: false },
    { id: 2, text: 'Build a demo app', completed: false },
];

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Generic login for demo purposes
    if (username && password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ error: 'Username and password required' });
    }
});

app.get('/api/todos', authenticateToken, (req, res) => {
    res.json(todos);
});

app.post('/api/todos', authenticateToken, (req, res) => {
    const { text } = req.body;
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.post('/api/reset', (req, res) => {
    todos = [
        { id: 1, text: 'Learn Cypress', completed: false },
        { id: 2, text: 'Build a demo app', completed: false },
    ];
    res.json({ message: 'Database reset' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
