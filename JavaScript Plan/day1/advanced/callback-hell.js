function step(name, delay, cb) {
    setTimeout(() => {
        console.log(name, "completed");
        cb();
    }, delay);
}

step("upload", 1000, () => {
    step("validation", 800, () => {
        step("feature extraction", 1200, () => {
            step("prediction", 700, () => {
                step("report generation", 500, () => {
                    console.log("pipeline finished");
                });
            });
        });
    });
});
