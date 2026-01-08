var a = 10;      // function scoped, old method, not recommended
let b = 20;      // block scoped, new definition for variable
const c = 30;    // cannot be reassigned

b = 25;
// c = 40; // will generate error

console.log(a, b, c);
