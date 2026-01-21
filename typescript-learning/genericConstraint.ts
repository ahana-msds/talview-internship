// constraint ensures T must have a length property

function getLength<T extends { length: number }>(item: T): number {
    return item.length;
}

console.log(getLength("hello"));       // string
console.log(getLength([1, 2, 3]));      // array

// error if uncommented
// console.log(getLength(10));
