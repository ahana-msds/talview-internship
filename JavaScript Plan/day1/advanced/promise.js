function upload(data) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("uploaded:", data);
            resolve(data);
        }, 800);
    });
}

function analyze(data) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("analyzed resume");
            resolve({ data, score: 0.87 });
        }, 1000);
    });
}

function storeResult(result) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("result stored in DB");
            resolve(result);
        }, 600);
    });
}

upload("resume.pdf")
    .then(analyze)
    .then(storeResult)
    .then(res => console.log("final output:", res))
    .catch(err => console.error(err));
