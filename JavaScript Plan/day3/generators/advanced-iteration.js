// generator function using *

function* idGenerator() {
    let id = 1;

    while (true) {
        yield id;   // pause and return value
        id++;
    }
}

const gen = idGenerator();

console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
