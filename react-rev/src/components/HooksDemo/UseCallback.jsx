import React, { useState, useCallback } from 'react';

/**
 * UseCallback Component
 * 
 * useCallback returns a memoized callback function.
 * This is useful when passing callbacks to optimized child components 
 * that rely on reference equality to prevent unnecessary renders.
 */

// Child component wrapped in React.memo (only re-renders if props change)
const Todos = React.memo(({ todos, addTodo }) => {
    console.log("Child render: Todos list");
    return (
        <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', marginTop: '10px' }}>
            <h4>Todo List (Memoized Child)</h4>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
            <button onClick={addTodo}>Add Todo</button>
        </div>
    );
});

const UseCallback = () => {
    const [count, setCount] = useState(0);
    const [todos, setTodos] = useState([]);

    const increment = () => {
        setCount((c) => c + 1);
    };

    // 1. Without useCallback: a new function is created on every render.
    // This causes the <Todos /> child to re-render even though its props haven't "changed" logically.
    /*
    const addTodo = () => {
      setTodos((t) => [...t, "New Todo"]);
    };
    */

    // 2. With useCallback: the function reference is memoized and only changes if dependencies change.
    // This prevents the <Todos /> child from re-rendering when 'count' changes.
    const addTodo = useCallback(() => {
        setTodos((t) => [...t, "New Todo"]);
    }, [todos]);

    return (
        <div className="hook-demo-box">
            <h3>useCallback Hook</h3>
            <p>Memoizes function references to prevent unnecessary child re-renders.</p>

            <div>
                <p>Count: <strong>{count}</strong></p>
                <button onClick={increment}>Increment Count</button>
                <p style={{ fontSize: '0.8em' }}>Incrementing count re-renders Parent, but with useCallback, Child stays stable.</p>
            </div>

            <Todos todos={todos} addTodo={addTodo} />

            <p style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
                * Observe the console. Child should not re-render when "Increment Count" is clicked.
            </p>
        </div>
    );
};

export default UseCallback;
