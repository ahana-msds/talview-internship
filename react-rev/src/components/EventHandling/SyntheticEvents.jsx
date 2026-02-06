import React, { useState } from 'react';

/**
 * Synthetic Event System Demo
 * 
 * React uses "Synthetic Events" which are wrappers around the browser's native events.
 * This ensures consistency across different browsers and improves performance via event delegation.
 */
const SyntheticEvents = () => {
    const [log, setLog] = useState('Wait for interaction...');

    // Event handler function
    const handleClick = (event) => {
        // 'event' here is a SyntheticEvent object, not a native DOM event.
        // However, it has the same interface (target, type, etc.)
        console.log('Synthetic Event:', event);

        setLog(`Clicked! Event Type: ${event.type}, Target: ${event.target.tagName}`);
    };

    const handleMouseEnter = () => {
        setLog('Mouse Entered the button area!');
    };

    const handleMouseLeave = () => {
        setLog('Mouse Left the button area!');
    };

    return (
        <div style={{ border: '2px solid #8b5cf6', padding: '20px', borderRadius: '8px', margin: '10px' }}>
            <h2>Synthetic Events & Handlers</h2>
            <p>React catches events at the root and wraps them in SyntheticEvents.</p>

            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f3ff', borderRadius: '4px' }}>
                <strong>Event Log:</strong> {log}
            </div>

            <button
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Interact with me!
            </button>

            <div style={{ marginTop: '10px', fontSize: '0.85em' }}>
                <em>Check the console to see the full SyntheticEvent object structure.</em>
            </div>
        </div>
    );
};

export default SyntheticEvents;
