import { InterviewStage } from "./types";
import { Evaluator } from "./evaluator";
import { processResponse } from "./processor";
import normalizeScore from "./legacyScorer";

// mock AI response
const response = {
    type: "video",
    duration: 30
} as const;

// process raw response
const rawScore = processResponse(response);

// normalize score using legacy JS
const finalScore = normalizeScore(rawScore);

// ✅ generic class works correctly now
const evaluator = new Evaluator<{ model: string }>(
    InterviewStage.Technical
);

const result = evaluator.evaluate(finalScore, {
    model: "vision-ai-v2"
});

console.log(result);
