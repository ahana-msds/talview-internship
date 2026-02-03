# react ssr demo

this project provides an implementation of server-side rendering (ssr) using react, vite, and express. it's designed to illustrate the core mechanics of ssr and hydration .
## key concepts demonstrated

- **`rendertostring`**: converting a react component tree into a static html string on the server.
- **hydration (`hydrateroot`)**: the process where react "attaches" itself to existing html in the browser, making it interactive without a full re-render.
- **vite ssr middleware**: using vite's development server as a middleware in express to handle on-the-fly typescript compilation and hmr during development.
- **shared architecture**: using the same `app.tsx` component for both server-side rendering and client-side hydration.

## project structure

- `server.js`: the express server that coordinates ssr.
- `index.html`: the html shell with a `<!--ssr-outlet-->` placeholder.
- `src/app.tsx`: the shared react application.
- `src/entry-server.tsx`: the entry point for server-side rendering.
- `src/entry-client.tsx`: the entry point for client-side hydration.
- `vite.config.ts`: configuration for vite and react plugin.

## how to run

### 1. installation
```bash
cd react-ssr-demo
npm install
```

### 2. development mode
runs the server with vite middleware (hmr and on-the-fly compilation).
```bash
npm run dev
```
explore the app at [http://localhost:5173](http://localhost:5173).

### 3. production mode
builds the client and server assets, then runs the production-ready express server.
```bash
npm run build
npm start
```

## verification steps

1. **view source**: right-click the page and select "view page source". you will see the full html pre-rendered, not just an empty `<div id="root"></div>`.
2. **hydration check**: click the "increment" button. it should be immediately interactive because react has hydrated the static server html.
3. **network tab**: notice that the first request for the document already contains the rendered content.
