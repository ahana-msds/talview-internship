
console.log("\nobject references & copying");

let user1 = { name: "Ahana" };
let user2 = user1; // reference copy

user2.name = "Arpita";
console.log("user1:", user1.name); // changed

// shallow copy
let original = { a: 1, b: { c: 2 } };
let copy = Object.assign({}, original);
copy.b.c = 99;

console.log("original after shallow copy change:", original);
console.log("copy:", copy);

// deep copy
let deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.b.c = 500;

console.log("original after deep copy change:", original);
console.log("deep copy:", deepCopy);

console.log("\ngarbage collection");
// JS automatically deletes objects with no references
let temp = { data: 123 };
temp = null; // eligible for garbage collection
console.log("object removed from memory automatically");

console.log("\nobject methods & 'this'");
let person = {
    name: "Ahana",
    greet() {
        console.log("hello, I am " + this.name);
    }
};
person.greet();

console.log("\nconstructor & new operator");

function User(name, age) {
    this.name = name;
    this.age = age;
}

let u1 = new User("A", 22);
let u2 = new User("B", 21);

console.log(u1);
console.log(u2);

console.log("\noptional chaining (?.)");

let employee = {
    id: 1,
    address: {
        city: "BLR"
    }
};

console.log(employee.address?.city);      // BLR
console.log(employee.contact?.phone);     // undefined (no error)

console.log("\nsymbol type");
let id = Symbol("id");
let obj = {
    name: "ID",
    [id]: 1505
};
console.log(obj[id]);
console.log(Object.keys(obj)); // symbol not shown

console.log("\nobject to primitive conversion");

let talview = {
    name: "employee",
    id: 1500,

    toString() {
        return this.name;
    },

    valueOf() {
        return this.id;
    }
};

console.log(String(talview)); // uses toString
console.log(talview + 5);    // uses valueOf
