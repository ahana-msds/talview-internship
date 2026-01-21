
import React, { useState } from 'react';

// component that purely handles logic (tracking mouse)
// and delegates rendering to a 'render' prop (or children)
const MouseTracker = ({ render }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        // update state with mouse coordinates relative to this container
        // optimized: could use throttle here for performance, but simple for demo
        setPosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    return (
        <div
            style={{ height: '300px', border: '1px dashed #999', position: 'relative', marginTop: '20px' }}
            onMouseMove={handleMouseMove}
        >
            <p style={{ position: 'absolute', top: 0, left: 0, padding: '5px' }}>
                move mouse inside this area (render props demo)
            </p>
            {/* dynamically call the render prop with current state */}
            {render(position)}
        </div>
    );
};

export default MouseTracker;
