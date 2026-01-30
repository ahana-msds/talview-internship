const _ = require('lodash');

/**
 * Lodash Examples
 * Demonstrates common utility functions provided by Lodash.
 */

// 1. Array Manipulation: Chunking
// Splits an array into groups the length of size.
const chunkArray = (array, size) => {
    return _.chunk(array, size);
};

// 2. Object Manipulation: Deep Clone
// Creates a deep copy of the value.
// Native JS '...spread' only does shallow copy.
const deepCloneObject = (obj) => {
    return _.cloneDeep(obj);
};

// 3. Collection Manipulation: Uniq
// Creates a duplicate-free version of an array.
const uniqueValues = (array) => {
    return _.uniq(array);
};

// 4. Object Pick
// Creates an object composed of the picked object properties.
const pickProperties = (obj, paths) => {
    return _.pick(obj, paths);
};

// 5. Debounce (Simulation)
// Note: Debounce is for async/event-handling, harder to return in sync flow, 
// but useful to know it exists. Here we just export the lodash wrapper.
const createDebouncedFunction = (func, wait) => {
    return _.debounce(func, wait);
};

module.exports = {
    chunkArray,
    deepCloneObject,
    uniqueValues,
    pickProperties,
    createDebouncedFunction
};
