console.log("class basic syntax");

class candidate {
    constructor(name, role) {
        this.name = name;
        this.role = role;
    }

    introduce() {
        return `Hi, I am ${this.name}, applying for ${this.role}`;
    }
}

const c1 = new candidate("Ahana", "Data Scientist");
console.log(c1.introduce());



console.log("\nclass inheritance");

class assessmentcandidate extends candidate {
    constructor(name, role, score) {
        super(name, role); // call parent constructor
        this.score = score;
    }

    getResult() {
        return `${this.name} scored ${this.score}`;
    }
}

const c2 = new assessmentcandidate("Riya", "ML Intern", 91);
console.log(c2.introduce());
console.log(c2.getResult());



console.log("\nclass static properties & methods");

class EvaluationService {
    static company = "Talview";

    static getPlatformName() {
        return `evaluation platform: ${this.company}`;
    }
}

console.log(EvaluationService.company);
console.log(EvaluationService.getPlatformName());



console.log("\nclass private & protected fields");

// # → private (real private, not accessible outside)

class SecureReport {
    #internalScore;

    constructor(score) {
        this.#internalScore = score;
        this._reviewStatus = "pending"; // protected by convention
    }

    getScore() {
        return this.#internalScore;
    }
}

const report = new SecureReport(88);
console.log(report.getScore());
// console.log(report.#internalScore); will give error
console.log(report._reviewStatus); // accessible but should not be touched



console.log("\nextending built in classes");

class SmartArray extends Array {
    average() {
        return this.reduce((a, b) => a + b, 0) / this.length;
    }
}

const scores = new SmartArray(80, 90, 100);
console.log(scores.average());
console.log(scores instanceof Array);



console.log("\n===== instanceof CHECK =====");

console.log(c1 instanceof Candidate);            // true
console.log(c2 instanceof AssessmentCandidate);  // true
console.log(c2 instanceof Candidate);            // true
console.log(scores instanceof SmartArray);       // true



console.log("\n===== REAL-WORLD STYLE SERVICE CLASS =====");

class ModelService {
    constructor(modelName) {
        this.modelName = modelName;
    }

    async predict(input) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    model: this.modelName,
                    input,
                    confidence: (Math.random() * 0.2 + 0.8).toFixed(2)
                });
            }, 800);
        });
    }
}

(async () => {
    const model = new ModelService("ResumeRanker-v1");
    const result = await model.predict("candidate_resume.pdf");
    console.log("Prediction:", result);
})();
