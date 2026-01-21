type Scored = {
    score: number;
};

type Timestamped = {
    evaluatedAt: Date;
};

// intersection combines both
type EvaluationResult = Scored & Timestamped;

const result: EvaluationResult = {
    score: 85,
    evaluatedAt: new Date()
};

console.log(result);
