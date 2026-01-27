import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import App from './App.jsx';

export function render() {
    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    );
    return html;
}
