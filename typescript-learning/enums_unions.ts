console.log("=== Module 3.2: Enums and Union Types ===\n");
// --- 1. Enums ---
// Numeric Enum
enum Direction {
    Up = 1, // Custom initializer
    Down,   // 2
    Left,   // 3
    Right   // 4
}
console.log("--- Numeric Enum ---");
console.log(`Direction.Up: ${Direction.Up}`);
console.log(`Direction.Left: ${Direction.Left}`);
// Reverse mapping (only works for numeric enums)
console.log(`Name of value 2: ${Direction[2]}`);
// String Enum
enum Status {
    Success = "SUCCESS",
    Failure = "FAILURE",
    Pending = "PENDING"
}
console.log("\n--- String Enum ---");
console.log(`Status.Success: ${Status.Success}`);
// --- 2. Union Types ---
/**
 * Function accepting a Union Type.
 * The parameter 'input' can be either a string OR a number.
 */
function printId(id: number | string) {
    console.log(`Your ID is: ${id}`);
    // We can check the type to perform specific operations
    if (typeof id === "string") {
        console.log(`ID in uppercase: ${id.toUpperCase()}`);
    } else {
        console.log(`ID doubled: ${id * 2}`);
    }
}
console.log("\n--- Union Types ---");
printId(101);
printId("202-abc");