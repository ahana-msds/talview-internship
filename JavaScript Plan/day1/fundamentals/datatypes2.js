console.log("methods of primitives");

// primitives can use methods (JS auto-wraps them)
let str = "ahana";
console.log(str.toUpperCase());

let num = 12.3456;
console.log(num.toFixed(2));

console.log("\nnumbers");

let a = 10;
let b = 3;

console.log(a / b);
console.log(Math.round(4.6));
console.log(Math.max(5, 10, 2));
console.log(isNaN("hello"));

console.log("\nstrings ");

let msg = "hello javascript";

console.log(msg.length);
console.log(msg.includes("java"));
console.log(msg.slice(0, 5));
console.log(msg.replace("hello", "hi"));

console.log("\narrays");

let arr = [10, 20, 30, 40];

console.log(arr[0]);
arr.push(50);
arr.pop();
console.log(arr);

console.log("\narray methods");

let nums = [1, 2, 3, 4, 5];

let squared = nums.map(n => n * n);
let even = nums.filter(n => n % 2 === 0);
let sum = nums.reduce((acc, n) => acc + n, 0);

console.log("map:", squared);
console.log("filter:", even);
console.log("reduce:", sum);

console.log("find:", nums.find(n => n > 3));
console.log("some:", nums.some(n => n > 4));
console.log("every:", nums.every(n => n > 0));

console.log("\niterables");

let text = "JS";

for (let ch of text) {
    console.log(ch);
}

let setIter = new Set([1, 2, 3]);
for (let val of setIter) {
    console.log(val);
}

console.log("\nmap and set");

// map → key can be anything
let map = new Map();
map.set("name", "Ahana");
map.set(1, "number key");

console.log(map.get("name"));
console.log(map.size);

// set → unique values
let set = new Set([1, 2, 2, 3]);
set.add(4);
console.log(set);
console.log(set.has(2));

console.log("\nweakmap and weakset");

let obj1 = { id: 1 };

let weakMap = new WeakMap();
weakMap.set(obj1, "private data");

let weakSet = new WeakSet();
weakSet.add(obj1);

// only objects allowed, no iteration, garbage collected automatically
console.log("weakmap has obj1:", weakMap.has(obj1));
console.log("weakset has obj1:", weakSet.has(obj1));

console.log("\nobject keys, values, entries");

let student = {
    name: "Ahana",
    age: 22,
    course: "data science"
};

console.log(Object.keys(student));
console.log(Object.values(student));
console.log(Object.entries(student));



console.log("\ndestructuring assignment");

// array destructuring
let coords = [10, 20];
let [x, y] = coords;
console.log(x, y);

// object destructuring
let user = { uname: "A", city: "BLR" };
let { uname, city } = user;
console.log(uname, city);

console.log("\ndate and time");

let now = new Date();

console.log("current:", now);
console.log("year:", now.getFullYear());
console.log("month:", now.getMonth() + 1); // 0-based
console.log("date:", now.getDate());
console.log("time:", now.toLocaleTimeString());

let customDate = new Date(2025, 0, 1);
console.log("custom:", customDate.toDateString());
