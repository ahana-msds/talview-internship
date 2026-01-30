/**
 *  Script
 * Run this with `node src/index.js` to see the utilities in action WITHOUT the test runner.
 * This helps understand how to use the functions in a real application logic.
 */

const { add } = require('./utils/math-utils');
const { chunkArray } = require('./utils/lodash-examples');
const { getCurrentDateTime, formatDateReadable } = require('./utils/luxon-examples');
const { validateUser } = require('./validation/user-schema');

console.log("=== Node.js Testing & Utility Practice ===\n");

// 1. Math Utils Usage
console.log("--- Math Utils ---");
console.log(`2 + 3 = ${add(2, 3)}`);

// 2. Lodash Usage
console.log("\n--- Lodash Utils ---");
const bigArray = [1, 2, 3, 4, 5, 6, 7];
console.log(`Original Array: [${bigArray}]`);
console.log(`Chunked by 3:`, chunkArray(bigArray, 3));

// 3. Luxon Usage
console.log("\n--- Luxon Utils ---");
const now = getCurrentDateTime();
console.log(`Current ISO Time: ${now}`);
console.log(`Formatted Readable: ${formatDateReadable(now)}`);

// 4. Joi Validation Usage
console.log("\n--- Joi Validation ---");
const badUser = { username: 'a', email: 'bad-email' };
console.log("Validating invalid user:", badUser);
const validationResult = validateUser(badUser);
if (!validationResult.isValid) {
    console.log("Validation Failed with errors:");
    validationResult.errors.forEach(err => console.log(` - ${err}`));
}

const goodUser = {
    username: 'validUser',
    email: 'test@example.com',
    password: 'securePassword123',
    birth_year: 1995
};
console.log("\nValidating valid user:", goodUser);
const successResult = validateUser(goodUser);
if (successResult.isValid) {
    console.log("Validation Successful!");
    console.log("Sanitized Value:", successResult.value);
}

console.log("\n=== End  ===");
