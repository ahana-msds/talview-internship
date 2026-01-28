import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const root = process.cwd();

async function createServer() {
    const app = express();
    let vite;

    if (!isProd) {
        // During development, we use Vite's built-in dev server as middleware
        // to handle HMR and transformation of TypeScript files on the fly.
        const { createServer: createViteServer } = await import('vite');
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
        });
        app.use(vite.middlewares);
    } else {
        // In production, we serve pre-built static assets
        const compression = (await import('compression')).default;
        const sirv = (await import('sirv')).default;
        app.use(compression());
        app.use(sirv(path.resolve(__dirname, 'dist/client'), { extensions: [] }));
    }

    app.get(/^(?!\/src|@vite|@react-refresh).*/, async (req, res) => {
        const url = req.originalUrl;

        try {
            let template, render;

            if (!isProd) {
                // 1. Read index.html
                template = fs.readFileSync(path.resolve(root, 'index.html'), 'utf-8');
                // 2. Apply Vite HTML transforms (injects HMR client, etc.)
                template = await vite.transformIndexHtml(url, template);
                // 3. Load the server entry (compiled on the fly by Vite)
                render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
            } else {
                // In production: use built files
                template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
                // Node ESM requires the file extension or the full path for built files
                // @ts-ignore
                render = (await import('./dist/server/entry-server.js')).render;
            }

            // 4. Render the app into an HTML string
            const { html: appHtml } = await render();

            // 5. Inject the app-rendered HTML into the template.
            const html = template.replace(`<!--ssr-outlet-->`, appHtml);

            // 6. Send the rendered HTML back.
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            if (!isProd) vite.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });

    return { app };
}

createServer().then(({ app }) =>
    app.listen(5173, () => {
        console.log('SSR Server running at http://localhost:5173');
    })
);
