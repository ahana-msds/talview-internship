function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function* scoreStream() {
    let score = 70;

    while (score <= 75) {
        await wait(800);     // async pause
        yield score;
        score++;
    }
}
