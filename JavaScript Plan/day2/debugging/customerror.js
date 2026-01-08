class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "validationerror";
    }
}

class ModelError extends Error {
    constructor(message) {
        super(message);
        this.name = "modelerror";
    }
}

function runModel(score) {
    if (score < 50) {
        throw new ModelError("model confidence too low");
    }
    return "prediction successful";
}

try {
    runModel(40);

} catch (err) {
    if (err instanceof ValidationError) {
        console.error("validation error:", err.message);
    }
    else if (err instanceof ModelError) {
        console.error("model error:", err.message);
    }
    else {
        console.error("unknown error:", err.message);
    }
}
