import express from 'express';
const app = express();
app.use(express.json());

app.get('/search', (req, res) => {
    // 1. REQ.QUERY: Accessing items after '?' in URL
    const { q, limit } = req.query;

    // 2. RES.STATUS & RES.JSON: Sending structured responses
    res.status(200).json({
        message: 'Search logic',
        query: q || 'none',
        limit: limit || 10
    });
});

app.get('/item/:slug', (req, res) => {
    // 3. REQ.PARAMS: Accessing dynamic parts of the URL path
    const { slug } = req.params;
    res.send(`Viewing item with identifier: ${slug}`);
});

app.post('/echo', (req, res) => {
    // 4. REQ.BODY: Accessing data sent in the request body (needs express.json() middleware)
    res.json({ receivedBody: req.body });
});

app.listen(3006, () => {
    console.log('Req/Res Demo running on http://localhost:3006');
    console.log('Query: http://localhost:3006/search?q=nodejs&limit=5');
    console.log('Params: http://localhost:3006/item/macbook-pro');
});
