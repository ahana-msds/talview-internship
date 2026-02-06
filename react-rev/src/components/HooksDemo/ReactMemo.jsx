import React, { useState } from 'react';

/**
 * ReactMemo Component
 * 
 * React.memo is a higher-order component (HOC) for memoizing components.
 * If your component renders the same result given the same props, 
 * React.memo will skip rendering the component and reuse the last rendered result.
 */

// This component re-renders EVERY time parent re-renders
const RegularComponent = ({ name }) => {
    console.log("%cRegular component rendering...", "color: orange");
    return <div>Regular Child: {name}</div>;
};

// This component ONLY re-renders if 'name' prop changes
const MemoizedComponent = React.memo(({ name }) => {
    console.log("%cMemoized component rendering...", "color: green; font-weight: bold");
    return <div>Memoized Child: {name}</div>;
});

const ReactMemo = () => {
    const [count, setCount] = useState(0);
    const [name, setName] = useState("React");

    return (
        <div className="hook-demo-box">
            <h3>React.memo (Optimization)</h3>
            <p>Prevents functional components from re-rendering if their props haven't changed.</p>

            <div style={{ marginBottom: '15px' }}>
                <p>Parent Count: <strong>{count}</strong></p>
                <button onClick={() => setCount(count + 1)}>Increment Parent Count</button>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Change specific prop..."
                />
            </div>

            <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <RegularComponent name={name} />
                <MemoizedComponent name={name} />
            </div>

            <p style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
                * Check console. Clicking "Increment Parent Count" only re-renders the regular child.
                The memoized child stays quiet until you change the Name input.
            </p>
        </div>
    );
};

export default ReactMemo;
