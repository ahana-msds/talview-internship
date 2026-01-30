const { expect } = require('chai');
const { add, subtract, multiply, divide } = require('../../src/utils/math-utils');

/**
 * Mocha Tests for Math Utilities
 * 
 * Mocha is the test runner (uses 'describe', 'it').
 * Chai is the assertion library (uses 'expect', 'should', or 'assert').
 */

describe('Math Utilities (Mocha + Chai)', () => {

    describe('add function', () => {
        it('should add two positive numbers correctly', () => {
            expect(add(2, 3)).to.equal(5);
        });

        it('should handle negative numbers', () => {
            expect(add(-1, -1)).to.equal(-2);
        });
    });

    describe('subtract function', () => {
        it('should subtract two numbers correctly', () => {
            expect(subtract(5, 2)).to.equal(3);
        });
    });

    describe('multiply function', () => {
        it('should multiply two numbers correctly', () => {
            expect(multiply(4, 3)).to.equal(12);
        });
    });

    describe('divide function', () => {
        it('should divide two numbers correctly', () => {
            expect(divide(10, 2)).to.equal(5);
        });

        it('should throw an error when dividing by zero', () => {
            // In Chai, to test for errors, wrap in function
            expect(() => divide(10, 0)).to.throw('Cannot divide by zero');
        });
    });
});
