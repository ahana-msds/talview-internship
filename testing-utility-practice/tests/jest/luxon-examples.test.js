const { getCurrentDateTime, formatDateReadable, addDaysToDate, getDifferenceInDays } = require('../../src/utils/luxon-examples');
const { DateTime } = require('luxon');

describe('Luxon Date Utility Tests', () => {

    test('getCurrentDateTime should return a string', () => {
        expect(typeof getCurrentDateTime()).toBe('string');
    });

    test('formatDateReadable should format ISO string', () => {
        // Oct 14, 1983
        const result = formatDateReadable('1983-10-14T10:30:00.000Z');
        // The output depends on locale, but usually contains "Oct" and "1983"
        expect(result).toContain('Oct');
        expect(result).toContain('1983');
    });

    test('addDaysToDate should add days correctly', () => {
        const start = '2023-01-01T00:00:00.000Z';
        const result = addDaysToDate(start, 5);
        const expected = DateTime.fromISO(start).plus({ days: 5 }).toISO();
        expect(result).toBe(expected);
    });

    test('getDifferenceInDays should calculate diff', () => {
        const start = '2023-01-01T00:00:00.000Z';
        // 10 days later
        const end = '2023-01-11T00:00:00.000Z';
        expect(getDifferenceInDays(start, end)).toBe(10);
    });
});
