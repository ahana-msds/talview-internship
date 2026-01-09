function* candidateProcessor(candidates) {
    let id = 1;

    for (let name of candidates) {
        yield `id ${id}: processing ${name}`;
        id++;
    }
}

const stream = candidateProcessor(["ahana", "riya", "neha"]);

for (let msg of stream) {
    console.log(msg);
}
