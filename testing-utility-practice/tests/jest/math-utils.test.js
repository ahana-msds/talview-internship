const { add, subtract, multiply, divide } = require('../../src/utils/math-utils');

/**
 * Jest Tests for Math Utilities
 * 
 * Jest uses 'describe' to group tests and 'test' (or 'it') to define individual test cases.
 * 'expect' is used for assertions.
 */

describe('Math Utilities (Jest)', () => {

    // Grouping Addition Tests
    describe('add function', () => {
        test('should add two positive numbers correctly', () => {
            expect(add(2, 3)).toBe(5);
        });

        test('should handle negative numbers', () => {
            expect(add(-1, -1)).toBe(-2);
        });
    });

    // Grouping Subtraction Tests
    describe('subtract function', () => {
        test('should subtract two numbers correctly', () => {
            expect(subtract(5, 2)).toBe(3);
        });
    });

    // Grouping Multiplication Tests
    describe('multiply function', () => {
        test('should multiply two numbers correctly', () => {
            expect(multiply(4, 3)).toBe(12);
        });
    });

    // Grouping Division Tests
    describe('divide function', () => {
        test('should divide two numbers correctly', () => {
            expect(divide(10, 2)).toBe(5);
        });

        test('should throw an error when dividing by zero', () => {
            // When testing for errors, wrap the call in a function
            expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
        });
    });
});
