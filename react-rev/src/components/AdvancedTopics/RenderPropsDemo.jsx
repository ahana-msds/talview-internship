import React, { useState } from 'react';

/**
 * RenderPropsDemo
 * 
 * Chapter 12.4: Render Props.
 * A term for a technique for sharing code between React components using a prop whose value is a function.
 */

// 1. The reusable logic component: MouseTracker
// It manages the mouse position state and "calls back" to render whatever is requested.
const MouseTracker = ({ render }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    return (
        <div style={trackerStyle} onMouseMove={handleMouseMove}>
            {/* 
        This is the KEY: Instead of rendering its own UI, 
        it calls the function passed via the 'render' prop.
      */}
            {render(position)}
        </div>
    );
};

const RenderPropsDemo = () => {
    return (
        <div className="demo-section">
            <h3>12.4. Render Props Pattern</h3>
            <p style={{ fontSize: '0.85em' }}>Move your mouse over the box below to see the pattern in action.</p>

            <MouseTracker render={(pos) => (
                <div style={displayStyle}>
                    <h4>Mouse Position Tracker</h4>
                    <p>X: <strong>{pos.x}</strong>, Y: <strong>{pos.y}</strong></p>
                    <div style={{
                        position: 'absolute',
                        left: pos.x - 200, // Adjusted for container relative pos
                        top: pos.y - 450, // Adjusted for container relative pos
                        width: '20px',
                        height: '20px',
                        background: '#ec4899',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        opacity: 0.5
                    }} />
                </div>
            )} />

            <div style={noteStyle}>
                <strong>Concept:</strong> The <code>MouseTracker</code> component encapsulates the <code>onMouseMove</code> behavior, but it delegates the actual rendering logic to the <code>render</code> function prop. This makes the tracking logic highly reusable for different visual indicators.
            </div>
        </div>
    );
};

const trackerStyle = {
    height: '250px',
    background: '#f1f5f9',
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'crosshair'
};

const displayStyle = { textAlign: 'center', pointerEvents: 'none' };
const noteStyle = { marginTop: '20px', padding: '10px', background: '#fdf2f8', border: '1px solid #f9a8d4', fontSize: '0.8em' };

export default RenderPropsDemo;
