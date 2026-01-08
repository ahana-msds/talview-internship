console.log("objects and arrays");

/* objects basics */

let student = {
    name: "Ahana",
    age: 22,
    skills: ["Python", "JavaScript"]
};

// access properties
console.log(student.name);
console.log(student["age"]);

// add / update property
student.city = "Bangalore";
student.age = 23;

console.log(student);

// delete property
delete student.city;
console.log("after delete:", student);



/* iterating objects */

console.log("\niterating object:");

for (let key in student) {
    console.log(key, ":", student[key]);
}



/* object with methods */

let calculator = {
    add(a, b) {
        return a + b;
    },
    sub(a, b) {
        return a - b;
    }
};

console.log("Add:", calculator.add(5, 3));
console.log("Sub:", calculator.sub(10, 4));



/* array basics  */

let marks = [80, 85, 90, 95];

// access
console.log(marks[0]);

// add elements
marks.push(100);     // end
marks.unshift(70);  // beginning

// remove elements
marks.pop();        // end
marks.shift();      // beginning

console.log("marks:", marks);



/* iterating arrays */

console.log("\niterating array:");

for (let i = 0; i < marks.length; i++) {
    console.log(marks[i]);
}

for (let value of marks) {
    console.log("for...of:", value);
}



/* array methods */

let nums = [1, 2, 3, 4, 5];

let doubled = nums.map(n => n * 2);
let even = nums.filter(n => n % 2 === 0);
let total = nums.reduce((sum, n) => sum + n, 0);

console.log("map:", doubled);
console.log("filter:", even);
console.log("reduce:", total);



/* objects inside arrays */

let students = [
    { name: "Ahana", marks: 95 },
    { name: "Riya", marks: 90 },
    { name: "Neha", marks: 75 }
];

let toppers = students.filter(s => s.marks >= 85);
console.log("toppers:", toppers);



/* arrays inside objects */

let classRoom = {
    subject: "JavaScript",
    attendees: ["Ahana", "Riya", "Neha"]
};

classRoom.attendees.push("Pooja");
console.log(classRoom);



/* copying arrays & objects */

// array copy
let arr1 = [1, 2, 3];
let arrCopy = [...arr1];
arrCopy[0] = 99;

console.log("original array:", arr1);
console.log("copied array:", arrCopy);

// object   copy
let obj1 = { a: 1, b: 2 };
let objCopy = { ...obj1 };
objCopy.a = 50;

console.log("original object:", obj1);
console.log("copied object:", objCopy);



/* destructuring */

let user = { uname: "Ahana", role: "Intern" };
let { uname, role } = user;
console.log(uname, role);

let coords = [10, 20];
let [x, y] = coords;
console.log(x, y);
