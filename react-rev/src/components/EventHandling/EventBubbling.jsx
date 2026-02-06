import React, { useState } from 'react';

/**
 * Event Bubbling and Capturing Demo
 * 
 * Bubbling: The event starts from the target and propagates UP reached the root.
 * Capturing: The event starts from the root and propagates DOWN to the target.
 * 
 * In React, event handlers usually run in the BUBBLING phase unless specified otherwise.
 */
const EventBubbling = () => {
    const [message, setMessage] = useState('Click a box to see propagation order');

    const handleParentClick = (e) => {
        console.log('Parent (Bubbling phase)');
        setMessage(prev => prev + ' -> Parent');
    };

    const handleChildClick = (e) => {
        console.log('Child (Bubbling phase)');
        setMessage('Child clicked');
    };

    // React supports capturing phase by appending "Capture" to the event name
    const handleParentCapture = (e) => {
        console.log('Parent (Capturing phase)');
        // This will run BEFORE the child's bubbling handler
    };

    return (
        <div style={{ border: '2px solid #ec4899', padding: '20px', borderRadius: '8px', margin: '10px' }}>
            <h2> Bubbling and Capturing</h2>
            <p>Watch the order of execution in the log below:</p>

            <div
                onClick={handleParentClick}
                onClickCapture={handleParentCapture}
                style={{ padding: '40px', backgroundColor: '#fce7f3', border: '2px dashed #ec4899', cursor: 'pointer' }}
            >
                <strong>Parent Box (Click Me)</strong>

                <div
                    onClick={handleChildClick}
                    style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fdf2f8', border: '1px solid #ec4899' }}
                >
                    <strong>Child Box (Click Me)</strong>
                </div>
            </div>

            <div style={{ marginTop: '15px', fontWeight: 'bold' }}>
                Path: <span style={{ color: '#ec4899' }}>{message}</span>
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.85em' }}>
                <em>Capturing handlers (Parent Capture) run first, then child bubbling, then parent bubbling.</em>
            </div>
        </div>
    );
};

export default EventBubbling;
