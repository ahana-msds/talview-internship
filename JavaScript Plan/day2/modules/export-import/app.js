import { generateScore, getGrade } from "./scoring.js";
import { createReport } from "./report.js";

function runAssessment(candidate) {
    const score = generateScore();
    const grade = getGrade(score);
    const report = createReport(candidate, score, grade);

    console.log(report);
}

runAssessment("Ahana");
