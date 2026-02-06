import { useState, useCallback } from 'react';

/**
 * useCounter - A custom React Hook
 * 
 * Custom hooks allow you to extract component logic into reusable functions.
 * They must start with the word 'use'.
 * 
 * @param {number} initialValue - The starting count
 * @returns {object} { count, increment, decrement, reset }
 */
const useCounter = (initialValue = 0) => {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount((prev) => prev + 1);
    }, []);

    const decrement = useCallback(() => {
        setCount((prev) => prev - 1);
    }, []);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    return { count, increment, decrement, reset };
};

export default useCounter;
