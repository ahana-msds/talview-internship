// a generic function that works with ANY data type
// T is a type placeholder decided at function call time

function identity<T>(value: T): T {
    return value;
}

// using the function with different data types
const numberValue = identity<number>(10);
const stringValue = identity<string>("typescript");
const booleanValue = identity(true);

console.log(numberValue, stringValue, booleanValue);
