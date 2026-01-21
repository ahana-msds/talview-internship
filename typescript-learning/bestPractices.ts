// single responsibility principle

type Candidate = {
    name: string;
    score: number;
};

class ScoreService {
    calculate(candidate: Candidate): number {
        return candidate.score * 1.2;
    }
}

class Logger {
    log(message: string) {
        console.log("[LOG]", message);
    }
}

const candidate: Candidate = { name: "Ahana", score: 80 };
const service = new ScoreService();
const logger = new Logger();

logger.log(`final score: ${service.calculate(candidate)}`);
