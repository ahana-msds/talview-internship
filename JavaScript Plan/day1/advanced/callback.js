function uploadData(data, cb) {
    setTimeout(() => {
        console.log("Data uploaded:", data);
        cb(null, data);
    }, 1000);
}

function preprocess(data, cb) {
    setTimeout(() => {
        let processed = data.toUpperCase();
        console.log("Data preprocessed");
        cb(null, processed);
    }, 1000);
}

function scoreModel(data, cb) {
    setTimeout(() => {
        let score = Math.random().toFixed(2);
        console.log("Model scored");
        cb(null, { data, score });
    }, 1000);
}

// pipeline
uploadData("candidate resume", (err, data) => {
    if (err) return console.error(err);

    preprocess(data, (err, processed) => {
        if (err) return console.error(err);

        scoreModel(processed, (err, result) => {
            if (err) return console.error(err);
            console.log("Final Result:", result);
        });
    });
});
