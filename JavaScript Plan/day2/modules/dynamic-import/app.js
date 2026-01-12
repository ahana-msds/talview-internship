async function runDeepCheck(score) {

    console.log("loading analytics module...");

    const analytics = await import("./analytics.js");
    analytics.deepAnalysis(score);
}

runDeepCheck(92);
