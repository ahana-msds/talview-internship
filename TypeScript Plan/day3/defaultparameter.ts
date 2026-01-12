function getScoreWithDefault(score: number, bonus: number = 5): number {
    return score + bonus;
}

console.log(getScoreWithDefault(80));
console.log(getScoreWithDefault(80, 10)); 
