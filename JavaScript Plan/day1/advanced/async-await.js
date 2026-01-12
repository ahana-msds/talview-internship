function fetchCandidate(id) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ id, name: "Candidate A" }), 700);
    });
}

function runAssessment(candidate) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ ...candidate, score: 92 }), 1000);
    });
}

function generateReport(result) {
    return new Promise(resolve => {
        setTimeout(() => resolve("Report ready for " + result.name), 500);
    });
}

async function evaluationPipeline() {
    try {
        const candidate = await fetchCandidate(101);
        const result = await runAssessment(candidate);
        const report = await generateReport(result);

        console.log("Final:", report);
    } catch (err) {
        console.error("Pipeline failed:", err);
    }
}

evaluationPipeline();
