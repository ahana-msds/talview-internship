/**
 * Math Utilities for Testing Demonstration
 * 
 * These functions are simple to ease the understanding of unit testing concepts.
 */

// Adds two numbers
const add = (a, b) => {
    return a + b;
};

// Subtracts b from a
const subtract = (a, b) => {
    return a - b;
};

// Multiplies two numbers
const multiply = (a, b) => {
    return a * b;
};

// Divides a by b. Throws error if b is 0.
const divide = (a, b) => {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
};

module.exports = {
    add,
    subtract,
    multiply,
    divide
};
