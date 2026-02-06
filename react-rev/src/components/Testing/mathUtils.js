/**
 * mathUtils.js
 * 
 * Simple utility functions to demonstrate unit testing of pure logic.
 */

export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export const multiply = (a, b) => a * b;

export const divide = (a, b) => {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
};
