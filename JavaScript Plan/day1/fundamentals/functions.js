console.log("function declaration");
function greet() {
    console.log("hello!");
}
greet();

console.log("\nlocal variables");
function showMessage() {
    let message = "this is a local variable";
    console.log(message);
}
showMessage();
// console.log(message);  error: message is not defined

console.log("\nouter variables");
let userName = "Ahana"; // outer variable

function sayHi() {
    console.log("hi " + userName); // can access outer variable
}
sayHi();

console.log("\nparameters");

function add(a, b) { // parameters
    console.log("sum:", a + b);
}
add(3, 5); // arguments

console.log("\ndefault values");

function greetUser(name = "Guest") {
    console.log("Welcome " + name);
}

greetUser("Ahana");
greetUser(); // uses default value

console.log("\nreturning a value");

function multiply(x, y) {
    return x * y; // return sends value back
}

let result = multiply(4, 5);
console.log("result:", result);

console.log("\nnaming a function");

// names describe what the function does
function showAge(age) {
    console.log("Age is:", age);
}

function checkPermission(user) {
    return user === "admin";
}

console.log(checkPermission("admin"));

console.log("\nfunctions == comments (self-documenting code)");

// instead of writing comments:
function calculateTotal(price, tax) {
    return price + tax;
}

// name itself explains purpose better than comments
let total = calculateTotal(100, 18);
console.log("Total:", total);

// arrow function
const mul = (x, y) => x * y;
console.log("mul:", mul(4, 5));