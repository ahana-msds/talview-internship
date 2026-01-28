import React, { useState, useEffect } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log('App hydrated and effect running!');
    }, []);

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
            <h1>React SSR </h1>
            <p>This page was rendered on the <strong>Server</strong> and then hydrated on the <strong>Client</strong>.</p>

            <div style={{ margin: '2rem 0', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>Counter: {count}</h2>
                <button
                    onClick={() => setCount(count + 1)}
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    Increment
                </button>
            </div>

            <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                <h3>What happened here?</h3>
                <ol>
                    <li><strong>Server:</strong> The Express server rendered this component to an HTML string using <code>renderToString</code>.</li>
                    <li><strong>Browser:</strong> You received the full HTML immediately (check "View Source").</li>
                    <li><strong>Hydration:</strong> React loaded on the client and "attached" itself to the existing HTML, making the button above interactive without a full re-render.</li>
                </ol>
            </div>
        </div>
    );
}
