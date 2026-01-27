import express from 'express';
const app = express();

// 1. Application-level Middleware (runs for every request)
app.use((req, res, next) => {
    console.log(`[LOG] Time: ${new Date().toLocaleTimeString()} | Path: ${req.url}`);
    next(); // Move to the next function
});

// 2. Route-level Middleware (specific to one endpoint)
const secretGuard = (req, res, next) => {
    if (req.query.token === 'pass123') next();
    else res.status(403).send('Forbidden: Invalid Token');
};

app.get('/secret', secretGuard, (req, res) => {
    res.send('Welcome to the Secret Chamber!');
});

app.get('/public', (req, res) => res.send('This is a public page.'));

app.listen(3005, () => {
    console.log('Middleware Demo running on http://localhost:3005');
    console.log('Test Private: http://localhost:3005/secret?token=pass123');
});
