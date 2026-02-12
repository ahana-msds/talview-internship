const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { handler } = require('./handler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Wrapper for Hasura Action
app.post('/calculate-quote', async (req, res) => {
    try {
        // Hasura sends action payload in req.body
        // Structure: { action: { name: "..." }, input: { ... }, session_variables: { ... } }
        const result = await handler(req.body);

        // Success response
        res.json(result);
    } catch (error) {
        // Error response for Hasura
        res.status(400).json({
            message: error.message || "Internal Calculation Error",
            code: "CALCULATION_ERROR"
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🚀 Functions service running on port ${PORT}`);
});
