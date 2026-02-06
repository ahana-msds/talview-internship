import React, { useRef, useState } from 'react';

/**
 * UseRef Component
 * 
 * useRef returns a mutable ref object whose .current property is initialized to the passed argument.
 * 1. Persistent value: It persists between re-renders but doesn't cause a re-render when it changes.
 * 2. DOM Access: Provides direct access to a DOM node.
 */
const UseRef = () => {
    const [count, setCount] = useState(0);

    // 1. Reference to a DOM element
    const inputRef = useRef(null);

    // 2. Reference to a persistent value (not shown in UI, doesn't trigger re-render)
    const renderCount = useRef(0);
    renderCount.current++;

    const handleFocus = () => {
        // Direct DOM manipulation
        inputRef.current.focus();
        inputRef.current.value = "Focused via Ref!";
    };

    return (
        <div className="hook-demo-box">
            <h3>useRef Hook</h3>
            <p>Direct DOM access and storage of mutable values that don't trigger re-renders.</p>

            <div style={{ marginBottom: '15px' }}>
                <input ref={inputRef} placeholder="I can be focused..." style={{ padding: '8px' }} />
                <button onClick={handleFocus} style={{ marginLeft: '10px' }}>Focus Input</button>
            </div>

            <p>Component re-renders: <strong>{renderCount.current}</strong></p>
            <button onClick={() => setCount(count + 1)}>Trigger Re-render (Increment Count: {count})</button>

            <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#666' }}>
                Updating <code>renderCount.current</code> does not trigger a re-render.
                Only <code>setCount</code> does.
            </div>
        </div>
    );
};

export default UseRef;
