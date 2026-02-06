import React, { useState, useRef } from 'react';

/**
 * ControlledVsUncontrolled Component
 * 
 * Chapter 7.1: Understanding the difference between controlled and uncontrolled components.
 */
const ControlledVsUncontrolled = () => {
    // --- Controlled Component State ---
    // The state is the "single source of truth" for the input's value.
    const [controlledValue, setControlledValue] = useState('');

    // --- Uncontrolled Component Ref ---
    // The DOM itself maintains the value; we access it using a ref when needed.
    const uncontrolledRef = useRef(null);

    const handleControlledChange = (e) => {
        setControlledValue(e.target.value);
    };

    const showValues = () => {
        alert(`
      Controlled: ${controlledValue}
      Uncontrolled (via ref): ${uncontrolledRef.current.value}
    `);
    };

    return (
        <div className="demo-section">
            <h3>7.1. Controlled vs Uncontrolled Components</h3>

            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                {/* Controlled Input */}
                <div style={boxStyle}>
                    <h4>Controlled</h4>
                    <p style={{ fontSize: '0.8em' }}>React state manages the value.</p>
                    <input
                        type="text"
                        value={controlledValue}
                        onChange={handleControlledChange}
                        placeholder="Type here..."
                        style={inputStyle}
                    />
                    <p>Current state: <code>{controlledValue}</code></p>
                </div>

                {/* Uncontrolled Input */}
                <div style={boxStyle}>
                    <h4>Uncontrolled</h4>
                    <p style={{ fontSize: '0.8em' }}>DOM manages the value (via refs).</p>
                    <input
                        type="text"
                        ref={uncontrolledRef}
                        defaultValue="Initial value"
                        placeholder="Type here..."
                        style={inputStyle}
                    />
                    <p>Value accessed only on demand.</p>
                </div>
            </div>

            <button onClick={showValues} style={btnStyle}>Compare Values</button>

            <div style={{ marginTop: '15px', color: '#666', fontSize: '0.9em' }}>
                <strong>Note:</strong> Controlled components are preferred in React as they allow for immediate validation and synchronization.
            </div>
        </div>
    );
};

const boxStyle = {
    padding: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#fff'
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    marginTop: '10px'
};

const btnStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

export default ControlledVsUncontrolled;
