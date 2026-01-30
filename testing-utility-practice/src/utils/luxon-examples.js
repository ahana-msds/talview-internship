const { DateTime } = require('luxon');

/**
 * Luxon Examples
 * Demonstrates date and time manipulation.
 */

// 1. Get Current DateTime
const getCurrentDateTime = () => {
    return DateTime.now().toString(); // ISO String
};

// 2. Format Date
// Formats a date to a human-readable string (e.g., 'Oct 14, 1983')
const formatDateReadable = (isoString) => {
    return DateTime.fromISO(isoString).toLocaleString(DateTime.DATE_MED);
};

// 3. Add Time
// Adds days to a specific date
const addDaysToDate = (isoString, days) => {
    return DateTime.fromISO(isoString).plus({ days }).toISO();
};

// 4. Time Zone Conversion
// Converts a time to a different timezone
const convertToZone = (isoString, zone) => {
    // e.g., zone = 'America/New_York'
    return DateTime.fromISO(isoString).setZone(zone).toString();
};

// 5. Diff Dates
// Calculates difference between two dates in specific unit
const getDifferenceInDays = (startIso, endIso) => {
    const start = DateTime.fromISO(startIso);
    const end = DateTime.fromISO(endIso);
    return end.diff(start, 'days').toObject().days;
};

module.exports = {
    getCurrentDateTime,
    formatDateReadable,
    addDaysToDate,
    convertToZone,
    getDifferenceInDays
};
