import React from 'react';

/**
 * TestingDemo Component
 * 
 * Chapter: Unit Testing with Jest/Vitest.
 */
const TestingDemo = () => {
    return (
        <div className="demo-section">
            <h3>11. Unit Testing (Jest & Vitest)</h3>

            <div style={infoBoxStyle}>
                <h4>1. Why Jest / Vitest?</h4>
                <p>Jest is the most popular testing framework for React. Vitest is a modern alternative designed specifically for Vite projects, offering 100% Jest compatibility.</p>
                <ul style={listStyle}>
                    <li><strong>describe:</strong> Groups related tests together.</li>
                    <li><strong>it / test:</strong> Defines an individual test case.</li>
                    <li><strong>expect:</strong> Asserts that a value meets certain conditions (matchers).</li>
                </ul>
            </div>

            <div style={infoBoxStyle}>
                <h4>2. Coverage & Test Quality</h4>
                <p><strong>Code Coverage:</strong> A metric that shows how much of your code is executed by tests. High coverage (80%+) is a sign of good quality, but not a guarantee of zero bugs.</p>
                <p><strong>Quality Tests should be:</strong></p>
                <ul style={listStyle}>
                    <li><strong>Deterministic:</strong> Always yield the same result.</li>
                    <li><strong>Isolated:</strong> One test should not depend on another.</li>
                    <li><strong>Descriptive:</strong> The test name should explain the expected behavior.</li>
                </ul>
            </div>

            <div style={exampleBoxStyle}>
                <h4>Live Example: Testing <code>mathUtils.js</code></h4>
                <p>Open <code>src/components/Testing/mathUtils.test.js</code> to see the following test structure:</p>
                <pre style={codeBlockStyle}>
                    {`describe('Math Utilities', () => {
  it('should correctly add numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});`}
                </pre>
                <div style={commandStyle}>
                    To run tests, execute: <br />
                    <code>npm test</code> or <code>npx vitest</code>
                </div>
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

const exampleBoxStyle = {
    padding: '15px',
    background: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px'
};

const codeBlockStyle = {
    background: '#1e293b',
    color: '#f8fafc',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '0.85em',
    overflowX: 'auto'
};

const commandStyle = {
    marginTop: '15px',
    padding: '10px',
    background: '#f1f5f9',
    borderLeft: '4px solid #3b82f6',
    fontSize: '0.9em'
};

const listStyle = { fontSize: '0.9em', marginLeft: '20px' };

export default TestingDemo;
