// reusable type alias
type InterviewID = string;
type Score = number;

type InterviewResult = {
    id: InterviewID;
    score: Score;
};

const result: InterviewResult = {
    id: "INT-101",
    score: 92
};

console.log(result);
