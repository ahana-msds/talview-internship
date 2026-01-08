let attendance = 85;

// if / else
if (attendance >= 90) console.log("allow exam");
else if (attendance >= 75) console.log("allow exam with conditions");
else console.log("not allowed");

// switch
let day = "student";
switch (day) {
    case "student": console.log("internship"); break;
    case "graduate": console.log("job"); break;
    default: console.log("Other");
}

// for loop
for (let i = 1; i <= 3; i++) console.log(i);

// while
let j = 0;
while (j < 3) {
    console.log("while", j);
    j++;
}

// do while
let k = 0;
do {
    console.log("do while", k);
    k++;
} while (k < 2);

// for...in (object)
let obj = { a: 1, b: 2 };
for (let key in obj) console.log(key, obj[key]);

// for...of (array)
let arr = [10, 20, 30];
for (let val of arr) console.log(val);

// break & continue
for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    if (i === 4) break;
    console.log(i);
}
