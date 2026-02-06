import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import BuggyComponent from './BuggyComponent';

/**
 * DebuggingDemo Component
 * 
 * Chapter : React DevTools and Debugging.
 */
const DebuggingDemo = () => {
    const [debugData, setDebugData] = useState({ id: 1, type: "Practice" });

    return (
        <div className="demo-section">
            <h3> Debugging and React DevTools</h3>

            <div style={infoBoxStyle}>
                <h4>1. React Developer Tools</h4>
                <p>This is a browser extension available for Chrome and Firefox.</p>
                <ul style={{ fontSize: '0.9em' }}>
                    <li><strong>Components Tab:</strong> Inspect the fiber tree, props, and state. Try selecting <code>DebuggingDemo</code> in DevTools!</li>
                    <li><strong>Profiler Tab:</strong> Record performance and see which components re-render and why.</li>
                </ul>
            </div>

            <div style={infoBoxStyle}>
                <h4>2. Common Debugging Techniques</h4>
                <ul style={{ fontSize: '0.9em' }}>
                    <li><code>console.log()</code>: Basic but effective for checking execution flow.</li>
                    <li><code>debugger</code>: Use this keyword to pause execution in DevTools.</li>
                    <li><strong>Breakpoints:</strong> Set them in the Sources tab of your browser.</li>
                </ul>
            </div>

            <div style={infoBoxStyle}>
                <h4>3. Error Boundaries (Live Demo)</h4>
                <p style={{ fontSize: '0.85em', color: '#666' }}>
                    Below is a <code>BuggyComponent</code> wrapped inside an <code>ErrorBoundary</code>.
                    When the child crashes, the boundary catches it and prevents the whole app from going white.
                </p>

                <ErrorBoundary>
                    <BuggyComponent />
                </ErrorBoundary>

                <p style={{ marginTop: '10px', fontSize: '0.85em' }}>
                    <em>Note: In DEVELOPMENT mode, React will still show an error overlay even with Error Boundaries. Just click the "X" on the top right to see the fallback UI.</em>
                </p>
            </div>
        </div>
    );
};

const infoBoxStyle = {
    padding: '15px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '15px'
};

export default DebuggingDemo;
