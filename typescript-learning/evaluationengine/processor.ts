import { CandidateResponse } from "./types";

export function isVideo(
    response: CandidateResponse
): response is { type: "video"; duration: number } {
    return response.type === "video";
}

export function processResponse(response: CandidateResponse): number {
    if (isVideo(response)) return response.duration * 2;
    if (response.type === "text") return response.wordCount * 1.5;
    if (response.type === "audio") return response.clarityScore * 3;
    return 0;
}
