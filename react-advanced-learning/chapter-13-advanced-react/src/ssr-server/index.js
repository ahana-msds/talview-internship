
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';

// crude ssr setup for demonstration
// in a real app, you'd use vite's ssrloadmodule
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// serve static files (client build)
app.use(express.static(path.resolve(__dirname, '../../dist'), { index: false }));

app.get('*', (req, res) => {
    // render app to string
    // note: context providers and browser-specific code (like window) need care in ssr
    // this is a simplified view
    const appHtml = renderToString(<App />);

    // read index.html from build
    const templatePath = path.resolve(__dirname, '../../dist/index.html');

    fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
            console.error(err);
            return res.status(500).send('error loading template');
        }

        // inject rendered html into the div#root
        const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
        res.send(html);
    });
});

app.listen(PORT, () => {
    console.log(`ssr server running at http://localhost:${PORT}`);
});
