import React from 'react';

/**
 * Functional Component
 * 
 * This is the modern way of writing React components.
 * It's essentially a JavaScript function that returns JSX.
 */
const FunctionalComponent = () => {
    // Functional components use hooks (like useState) for state management,
    // but for this basic demo, we just return a UI.
    return (
        <div style={{ border: '2px solid #646cff', padding: '20px', borderRadius: '8px', margin: '10px' }}>
            <h2>Functional Component</h2>
            <p>I am a Functional Component! I am defined as a regular JavaScript function.</p>
            <ul>
                <li>Concise and easier to read.</li>
                <li>Uses Hooks for logic (Effects, State, etc.).</li>
                <li>No 'this' keyword complexity.</li>
            </ul>
        </div>
    );
};

export default FunctionalComponent;
