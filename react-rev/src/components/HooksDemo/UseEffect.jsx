import React, { useState, useEffect } from 'react';

/**
 * UseEffect Component
 * 
 * useEffect allows you to perform side effects in functional components.
 * It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount.
 */
const UseEffect = () => {
    const [count, setCount] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 1. No dependency array: Runs on EVERY render
    useEffect(() => {
        console.log('Effect: Every render');
    });

    // 2. Empty dependency array []: Runs only once (on mount)
    useEffect(() => {
        console.log('Effect: Only on Mount (componentDidMount)');

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // 3. Cleanup function: Runs on unmount (componentWillUnmount)
        return () => {
            console.log('Effect: Cleanup (componentWillUnmount)');
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 4. With dependency [count]: Runs whenever 'count' changes
    useEffect(() => {
        console.log(`Effect: Count changed to ${count}`);
        document.title = `Count: ${count}`;
    }, [count]);

    return (
        <div className="hook-demo-box">
            <h3>useEffect Hook</h3>
            <p>Handles side effects (API calls, subscriptions, DOM manipulation).</p>

            <p>Window Width: <strong>{windowWidth}px</strong></p>
            <p>Count (updates title): <strong>{count}</strong></p>
            <button onClick={() => setCount(count + 1)}>Increment & Update Title</button>

            <div style={{ marginTop: '10px', fontStyle: 'italic', fontSize: '0.8em' }}>
                * Check the browser console and tab title to see the effect in action.
            </div>
        </div>
    );
};

export default UseEffect;
