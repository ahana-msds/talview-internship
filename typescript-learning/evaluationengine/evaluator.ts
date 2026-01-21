export interface EvaluationResult<T> {
    stage: string;
    score: number;
    metadata: T;
}

// 👇 export added here
export class Evaluator<T extends object> {
    constructor(private stage: string) { }

    evaluate(score: number, metadata: T): EvaluationResult<T> {
        return {
            stage: this.stage,
            score,
            metadata
        };
    }
}
