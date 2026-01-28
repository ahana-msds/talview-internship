import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// hydrateRoot is the key here. It expects the HTML already exists in the DOM.
// It will only attach event listeners and set up the React tree without 
// destructive re-rendering if the server HTML matches the React structure.
hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
