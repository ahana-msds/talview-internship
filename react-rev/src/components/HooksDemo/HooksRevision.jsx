import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * HooksRevision Component
 * 
 * This demonstrates five core React hooks in a single interactive dashboard:
 * 1. useState: Local state management.
 * 2. useEffect: Side effects (timers, logging).
 * 3. useRef: Direct DOM access and persistent values.
 * 4. useMemo: Memorizing expensive calculations.
 * 5. useCallback: Memorizing functions to prevent unnecessary child re-renders.
 */
const HooksRevision = () => {
    // --- 1. useState ---
    const [count, setCount] = useState(0);
    const [text, setText] = useState('');

    // --- 2. useEffect ---
    // This effect runs every time 'count' changes
    useEffect(() => {
        console.log(`Effect: Count updated to ${count}`);

        // Optional cleanup function (e.g., for timers or subscriptions)
        return () => {
            console.log('Effect Cleanup: Before next update or unmount');
        };
    }, [count]);

    // --- 3. useRef ---
    // Accessing a DOM element directly
    const inputRef = useRef(null);

    const focusInput = () => {
        // Current points to the actual DOM node
        inputRef.current.focus();
        inputRef.current.style.backgroundColor = '#fef3c7';
    };

    // --- 4. useMemo ---
    // Expensive calculation that only re-runs when 'count' changes
    const expensiveCalculation = (num) => {
        console.log('Calculating expensive result...');
        for (let i = 0; i < 100000000; i++) { } // Simulate slowness
        return num * 2;
    };

    const memoizedValue = useMemo(() => expensiveCalculation(count), [count]);

    // --- 5. useCallback ---
    // Memorized function that doesn't change unless dependencies change.
    // Useful when passing functions to memoized child components.
    const increment = useCallback(() => {
        setCount(prev => prev + 1);
    }, []); // Empty dependency array means this function reference is stable

    return (
        <div style={{ border: '2px solid #ec4899', padding: '20px', borderRadius: '12px', margin: '10px' }}>
            <h2 style={{ color: '#ec4899' }}>7. React Hooks Mastery</h2>

            {/* useState & useEffect Demo */}
            <section style={sectionStyle}>
                <h4>useState & useEffect</h4>
                <p>Current Count: <strong>{count}</strong></p>
                <button onClick={increment} style={buttonStyle}>Increment Count</button>
                <p style={{ fontSize: '0.85em', color: '#666' }}>Check console for useEffect logs.</p>
            </section>

            {/* useRef Demo */}
            <section style={sectionStyle}>
                <h4>useRef (DOM Access)</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Click button to focus..."
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button onClick={focusInput} style={{ ...buttonStyle, backgroundColor: '#f59e0b' }}>
                        Focus Input
                    </button>
                </div>
            </section>

            {/* useMemo Demo */}
            <section style={sectionStyle}>
                <h4>useMemo (Optimization)</h4>
                <p>Memoized Calculation (Count * 2): <strong>{memoizedValue}</strong></p>
                <p style={{ fontSize: '0.85em', color: '#666' }}>
                    Expensive calculation only re-runs when Count changes, not when you type below.
                </p>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type here to re-render..."
                    style={{ padding: '8px', width: '100%', marginTop: '5px' }}
                />
            </section>

            {/* useCallback explanation */}
            <section style={sectionStyle}>
                <h4>useCallback</h4>
                <p style={{ fontSize: '0.9em' }}>
                    The 'Increment' function is wrapped in <code>useCallback</code>, ensuring its reference remains stable across re-renders.
                </p>
            </section>
        </div>
    );
};

// Simple styles for the demo sections
const sectionStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #fce7f3'
};

const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#ec4899',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
};

export default HooksRevision;
