console.log("=== Module 3.1: Generics ===\n");
// --- 1. Generic Functions ---
/**
 * A simple generic function that returns the input value.
 * T captures the type of the argument passed.
 */
function identity<T>(arg: T): T {
    return arg;
}
const output1 = identity<string>("myString");
const output2 = identity<number>(100);
console.log(`String identity: ${output1}`);
console.log(`Number identity: ${output2}`);
// --- 2. Generic Classes ---
/**
 * A generic class 'Box' that can hold a value of any type T.
 */
class Box<T> {
    private contents: T;
    constructor(value: T) {
        this.contents = value;
    }
    getContents(): T {
        return this.contents;
    }
}
const numBox = new Box<number>(123);
console.log(`Box contains number: ${numBox.getContents()}`);
const strBox = new Box<string>("Hello Generics");
console.log(`Box contains string: ${strBox.getContents()}`);
// --- 3. Constraints on Generics ---
/**
 * Interface describing an object that has a length property.
 */
interface Lengthwise {
    length: number;
}
/**
 * A generic function constrained to types that have a .length property.
 * If we try to pass a number (which doesn't have .length), it will fail at compile time.
 */
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(`Length of argument: ${arg.length}`);
    return arg;
}
console.log("\n--- Constraints Demo ---");
loggingIdentity({ length: 10, value: 3 }); // Works because it has .length
loggingIdentity("String has length");      // Works because string has .length
// loggingIdentity(3);                     // Error: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
