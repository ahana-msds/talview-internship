/**
 * EVENT LOOP: Non-blocking I/O in action.
 */

console.log("1. Start");

// MACROTASK: SetTimeout goes to the Timer queue
setTimeout(() => {
    console.log("5. SetTimeout (Macrotask) runs");
}, 0);

// MICROTASK: Promise.then goes to the Microtask queue (Runs before Macrotasks!)
Promise.resolve().then(() => {
    console.log("4. Promise (Microtask) runs");
});

// SYNCHRONOUS: Traditional blocking loop
function heavyCalculation() {
    console.log("2. Starting Synchronous heavy loop...");
    let start = Date.now();
    while (Date.now() - start < 1000) { /* Block thread for 1 second */ }
    console.log("2. Heavy loop done.");
}

heavyCalculation();

console.log("3. End");

/**
 * LOG ORDER EXPLANATION:
 * 1. Start (Sync)
 * 2. Heavy calculation (Sync/Blocking)
 * 3. End (Sync)
 * 4. Promise (Microtask - executes immediately after the current sync task ends)
 * 5. SetTimeout (Macrotask - executes in the next iteration of the loop)
 */
