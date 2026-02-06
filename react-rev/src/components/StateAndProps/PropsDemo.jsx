import React from 'react';

/**
 * Props Demo Component
 * 
 * Props (short for properties) are used to pass data from a parent component
 * to a child component. They are read-only and immutable for the child.
 */
const ChildComponent = (props) => {
    // Props are received as an object in the first argument
    return (
        <div style={{ backgroundColor: '#f3f4f6', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
            <h4>Child Component</h4>
            <p>Message from parent: <strong>{props.message}</strong></p>
            <p>Number from parent: <strong>{props.count}</strong></p>
        </div>
    );
};

const PropsDemo = () => {
    return (
        <div style={{ border: '2px solid #10b981', padding: '20px', borderRadius: '8px', margin: '10px' }}>
            <h2>Understanding & Using Props</h2>
            <p>Props allow components to be dynamic and reusable by passing data down.</p>

            {/* Passing data to ChildComponent via attributes */}
            <ChildComponent message="Hello from the Parent!" count={42} />

            <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
                <em>Note: If you change a prop in the parent, the child will re-render to reflect the new value.</em>
            </div>
        </div>
    );
};

export default PropsDemo;
