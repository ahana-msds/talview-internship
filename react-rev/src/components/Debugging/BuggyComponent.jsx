import React, { useState } from 'react';

/**
 * BuggyComponent
 * 
 * A simple component designed to crash when a button is clicked.
 * This is used to test the ErrorBoundary.
 */
const BuggyComponent = () => {
    const [shouldCrash, setShouldCrash] = useState(false);

    if (shouldCrash) {
        // Simulate a JavaScript error (e.g., ReferenceError or TypeError)
        throw new Error('I crashed intentionaly for demonstration!');
    }

    return (
        <div style={boxStyle}>
            <h4>Potential Crash Site</h4>
            <p>I am a normal component... unless you click the button below.</p>
            <button
                onClick={() => setShouldCrash(true)}
                style={btnStyle}
            >
                Trigger Component Crash
            </button>
        </div>
    );
};

const boxStyle = {
    padding: '15px',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    background: '#fff'
};

const btnStyle = {
    padding: '8px 12px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

export default BuggyComponent;
