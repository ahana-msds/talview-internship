function getScore(score, bonus) {
    if (bonus) {
        return score + bonus;
    }
    return score;
}
console.log(getScore(80));
console.log(getScore(80, 10));
