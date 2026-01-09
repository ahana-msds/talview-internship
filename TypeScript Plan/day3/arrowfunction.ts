const evaluateAnswer = (isCorrect: boolean): number => {
    return isCorrect ? 5 : 0;
};

console.log(evaluateAnswer(true));
console.log(evaluateAnswer(false));
