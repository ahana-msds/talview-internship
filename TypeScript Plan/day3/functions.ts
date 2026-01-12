function calculateFinalScore(
    testScore: number,
    bonus: number
): number {
    return testScore + bonus;
}

let result = calculateFinalScore(80, 5);
console.log(result);

// calculateFinalScore("80", 5) : compile error
