function aptitude() {
    return new Promise(res => setTimeout(() => res("aptitude done"), 800));
}

function coding() {
    return new Promise(res => setTimeout(() => res("coding done"), 1200));
}

function personality() {
    return new Promise(res => setTimeout(() => res("personality done"), 1000));
}

async function runAllTests() {
    const results = await Promise.all([
        aptitude(),
        coding(),
        personality()
    ]);

    console.log("modules finished:", results);
}

runAllTests();
