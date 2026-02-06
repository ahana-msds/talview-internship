import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide } from './mathUtils';

/**
 * mathUtils.test.js
 * 
 * Demonstrates the Jest/Vitest API: describe, it, expect.
 */

describe('Math Utilities', () => {

    it('should correctly add two numbers', () => {
        expect(add(2, 3)).toBe(5);
    });

    it('should correctly subtract two numbers', () => {
        expect(subtract(10, 4)).toBe(6);
    });

    it('should correctly multiply two numbers', () => {
        expect(multiply(3, 4)).toBe(12);
    });

    it('should correctly divide two numbers', () => {
        expect(divide(10, 2)).toBe(5);
    });

    it('should throw an error when dividing by zero', () => {
        expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
    });
});
