function getScore(score: number, bonus?: number): number {
    if (bonus) {
        return score + bonus;
    }
    return score;
}

console.log(getScore(80));
console.log(getScore(80, 10));
