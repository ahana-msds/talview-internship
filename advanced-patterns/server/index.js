import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
    const app = express();

    // Create Vite server in middleware mode
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
        root: path.resolve(__dirname, '..')
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    app.use('*', async (req, res) => {
        const url = req.originalUrl;

        try {
            // 1. Read index.html
            let template = fs.readFileSync(
                path.resolve(__dirname, '../index.html'),
                'utf-8'
            );

            // 2. Apply Vite HTML transforms
            template = await vite.transformIndexHtml(url, template);

            // 3. Load the server entry
            const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

            // 4. Render the app HTML
            const appHtml = await render();

            // 5. Inject the app-rendered HTML into the template
            const html = template.replace('<!--app-html-->', appHtml);

            // 6. Send the rendered HTML back
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            vite.ssrFixStacktrace(e);
            console.error(e.stack);
            res.status(500).end(e.stack);
        }
    });

    app.listen(3002, () => {
        console.log('SSR Server running at http://localhost:3002');
    });
}

createServer();
