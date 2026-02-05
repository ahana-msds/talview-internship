import React, { useState } from 'react';

/**
 * State Demo Component
 * 
 * State is internal data that a component maintains.
 * Unlike props, state can be changed by the component itself.
 * Updating state triggers a re-render of the component.
 */
const StateDemo = () => {
    // useState is a hook that adds state to functional components
    // count: current state value
    // setCount: function to update the state
    const [count, setCount] = useState(0);

    // Function to handle updating state
    const increment = () => {
        // When setCount is called, React schedules a re-render
        setCount(prevCount => prevCount + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return (
        <div style={{ border: '2px solid #3b82f6', padding: '20px', borderRadius: '8px', margin: '10px' }}>
            <h2>2 & 4. Managing and Updating State</h2>
            <p>State is local to the component. When state changes, the UI updates automatically.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '15px 0' }}>
                <button
                    onClick={decrement}
                    style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    - Decrement
                </button>

                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{count}</span>

                <button
                    onClick={increment}
                    style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    + Increment
                </button>
            </div>

            <p style={{ fontSize: '0.9em', color: '#555' }}>
                Current State Value: <strong>{count}</strong>
            </p>
        </div>
    );
};

export default StateDemo;
