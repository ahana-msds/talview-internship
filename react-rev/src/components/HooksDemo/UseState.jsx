import React, { useState } from 'react';

/**
 * UseState Component
 * 
 * useState is the most fundamental hook. It adds local state to functional components.
 * It returns an array with two elements: the current state value and a function to update it.
 */
const UseState = () => {
    // State for a simple number
    const [count, setCount] = useState(0);

    // State for an object
    const [user, setUser] = useState({ name: 'Guest', role: 'Viewer' });

    return (
        <div className="hook-demo-box">
            <h3>useState Hook</h3>
            <p>Local state management in functional components.</p>

            <div style={{ margin: '15px 0', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <p>Count: <strong>{count}</strong></p>
                <button onClick={() => setCount(count + 1)}>Increment</button>
                <button onClick={() => setCount(0)} style={{ marginLeft: '10px' }}>Reset</button>
            </div>

            <div style={{ margin: '15px 0', padding: '10px', background: '#f1f5f9', borderRadius: '8px' }}>
                <p>User: <strong>{user.name}</strong> ({user.role})</p>
                <input
                    placeholder="Change name"
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    style={{ padding: '5px' }}
                />
            </div>
        </div>
    );
};

export default UseState;
