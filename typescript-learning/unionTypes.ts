// union allows multiple possible types

type Input = string | number;

function processInput(value: Input) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value * 2);
    }
}

processInput("typescript");
processInput(10);
