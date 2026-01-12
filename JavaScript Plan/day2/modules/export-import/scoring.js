export function generateScore() {
    return Math.floor(Math.random() * 40) + 60;
}

export function getGrade(score) {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Improvement";
}
