function evaluateScore(score) {
    if (typeof score !== "number") {
        throw new Error("score must be a number");
    }
    if (score < 0 || score > 100) {
        throw new Error("score must be between 0 and 100");
    }
    return score >= 75 ? "Pass" : "Fail";
}

try {
    const result = evaluateScore(100);
    console.log("   result:", result);

} catch (err) {
    console.error("evaluation error:", err.message);

} finally {
    console.log("evaluation attempt completed");
}
