import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * This function will be called by the Express server.
 * It returns the HTML string of our React application.
 */
export function render() {
    const html = renderToString(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    return { html };
}
