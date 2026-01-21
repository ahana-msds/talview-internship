// interview stage types
export enum InterviewStage {
    Screening = "screening",
    Technical = "technical",
    Hr = "hr"
}

// supported response formats
export type VideoResponse = {
    type: "video";
    duration: number;
};

export type TextResponse = {
    type: "text";
    wordCount: number;
};

export type AudioResponse = {
    type: "audio";
    clarityScore: number;
};

export type CandidateResponse =
    | VideoResponse
    | TextResponse
    | AudioResponse;
