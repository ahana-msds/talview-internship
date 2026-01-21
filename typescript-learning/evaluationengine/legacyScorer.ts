function normalizeScore(rawScore: number): number {
    return Math.min(100, Math.max(0, rawScore));
}

export = normalizeScore;
