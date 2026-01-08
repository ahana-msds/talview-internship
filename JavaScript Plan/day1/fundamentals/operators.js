console.log("arithmetic operators");

// unary
let x = 5;
console.log("unary +x:", +x);          // numeric conversion
console.log("unary -x:", -x);
// binary
let a = 10, b = 3;
console.log("addition:", a + b);
console.log("subtraction:", a - b);
console.log("multiplication:", a * b);
console.log("division:", a / b);
console.log("remainder:", a % b);
console.log("exponentiation:", a ** b);



console.log("\nnumeric conversion (unary +)");
let str = "25";
console.log("string:", str, typeof str);
console.log("after +str:", +str, typeof +str);



console.log("\ncomparison operators");
// number comparison
console.log(10 > 5);      // true
console.log(5 >= 10);     // false
// string comparison (lexicographical)
console.log("apple" > "banana"); // false
console.log("2" > "12");          // true (string comparison)
// different data types (type coercion)
console.log("5" == 5);   // true
console.log(true == 1);  // true
// strict equality (no type coercion)
console.log("5" === 5);  // false
console.log(true === 1); // false
// null and undefined comparison
console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(null > 0);   // false
console.log(null == 0);  // false
console.log(null >= 0);  // true (weird JS behavior)
console.log(undefined > 0);   // false
console.log(undefined == 0);  // false



console.log("\nlogical operators");
let age = 20;
let hasID = true;
console.log("AND:", age > 18 && hasID);     // true
console.log("OR:", age < 18 || hasID);      // true
console.log("NOT:", !hasID);                // false
// short-circuit behavior
console.log(false && "hello");  // false
console.log(true || "hello");   // true
