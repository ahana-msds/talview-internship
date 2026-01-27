import express from 'express';
const app = express();
const router = express.Router();

// 1. Basic Route
app.get('/', (req, res) => res.send('Main Application Entry'));

// 2. Modular Router (The professional way to group routes)
router.get('/profile', (req, res) => res.json({ name: 'Ahana', type: 'Intern' }));
router.get('/settings', (req, res) => res.json({ theme: 'dark' }));

// 3. Mounting the Router
app.use('/user', router);

app.listen(3004, () => {
    console.log('Express Routing Demo running on http://localhost:3004');
    console.log('Try: http://localhost:3004/user/profile');
});
