import React, { useState, useMemo } from 'react';

/**
 * UseMemo Component
 * 
 * useMemo returns a memoized value. It only recomputes the memoized value 
 * when one of the dependencies has changed.
 * This optimization helps to avoid expensive calculations on every render.
 */
const UseMemo = () => {
    const [count, setCount] = useState(0);
    const [todos, setTodos] = useState([]);

    // Expensive calculation simulated
    const expensiveCalculation = (num) => {
        console.log("Running expensive operation...");
        for (let i = 0; i < 1000000000; i++) { } // Large loop
        return num * 2;
    };

    // 1. Without useMemo: expensiveCalculation runs on EVERY render (slows down adding todos)
    // const calculation = expensiveCalculation(count);

    // 2. With useMemo: expensiveCalculation runs ONLY when count changes
    const calculation = useMemo(() => expensiveCalculation(count), [count]);

    const addTodo = () => {
        setTodos((t) => [...t, "New Todo"]);
    };

    return (
        <div className="hook-demo-box">
            <h3>useMemo Hook</h3>
            <p>Memoizes the result of a calculation between re-renders.</p>

            <div>
                <p>Count: <strong>{count}</strong></p>
                <button onClick={() => setCount(count + 1)}>Increment Count (Triggers calculation)</button>
                <p>Calculated Value (Count * 2): <strong>{calculation}</strong></p>
            </div>

            <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

            <div>
                <p>Todos: {todos.length}</p>
                <button onClick={addTodo}>Add Todo (Fast because calculation is memoized)</button>
            </div>

            <p style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
                * Open the console. Without <code>useMemo</code>, "Adding Todo" would be slow
                because the expensive calculation would run every time the list updates.
            </p>
        </div>
    );
};

export default UseMemo;
