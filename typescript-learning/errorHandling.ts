class EvaluationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EvaluationError";
    }
}

function evaluate(score: number) {
    if (score < 0) {
        throw new EvaluationError("score cannot be negative");
    }
    return score * 2;
}

try {
    console.log(evaluate(-10));
} catch (error) {
    if (error instanceof EvaluationError) {
        console.error("evaluation failed:", error.message);
    }
}
