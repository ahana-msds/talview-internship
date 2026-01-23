const http = require('http');
const PORT = 3000;
const server = http.createServer((req, res) => {
    // Log the request
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    // Set default headers
    res.setHeader('content-type', 'application/json');
    // Routing Logic
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: "welcome to the node.js http server!" }));
    } else if (req.method === 'GET' && req.url === '/users') {
        res.writeHead(200);
        res.end(JSON.stringify({
            users: [
                { id: 1, name: "ahana" },
                { id: 2, name: "prateek" }
            ]
        }));
    } else if (req.method === 'POST' && req.url === '/data') {
        let body = '';
        // Collect data chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });
        // When data is fully received
        req.on('end', () => {
            try {
                const parsedData = JSON.parse(body);
                console.log('[data received]', parsedData);
                res.writeHead(201); // 201 Created
                res.end(JSON.stringify({
                    status: "success",
                    received: parsedData
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "invalid json" }));
            }
        });
    } else {
        // 404 Not Found
        res.writeHead(404);
        res.end(JSON.stringify({ error: "route not found" }));
    }
});
server.listen(PORT, () => {
    console.log(`\n[INFO] server is running on http://localhost:${PORT}`);
    console.log('[INFO] press ctrl+c to stop');
});
