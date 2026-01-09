/** context: online assessment platform  */


/* 
   1. typed variables
   scenario: test session information
*/

let testDuration: number = 60; // minutes
let candidateName: string = "Ahana Das";
let hasCameraPermission: boolean = true;

console.log("session info:", testDuration, candidateName, hasCameraPermission);


/* 
   2. typed function
   scenario: display greeting on dashboard
*/

function generateGreeting(name: string): string {
    return `Welcome to your assessment, ${name}`;
}

console.log(generateGreeting(candidateName));


/* 
   3. interface
   scenario: candidate profile from backend API
*/

interface Candidate {
    id: number;
    fullName: string;
    email: string;
    hasSubmitted?: boolean; // optional
}

const candidate1: Candidate = {
    id: 2001,
    fullName: "Ahana Das",
    email: "ahana.d@gmail.com",
    hasSubmitted: true
};

console.log("candidate profile:", candidate1);


/* 
   4. typed array
   scenario: section-wise scores
*/

let sectionScores: number[] = [18, 22, 25];

sectionScores.push(30);
// sectionScores.push("40");  not allowed

console.log("section scores:", sectionScores);


/* 
   5. union types
   scenario: assessment ID from backend
*/

let assessmentId: number | string;

assessmentId = 5043;
assessmentId = "TEMP-5043";

console.log("assessment ID:", assessmentId);


/* 
   6. type alias
   scenario: API request status
*/

type RequestStatus = "idle" | "processing" | "completed" | "failed";

let uploadStatus: RequestStatus = "processing";

console.log("upload status:", uploadStatus);


/* 
   7. optional parameter in function
   scenario: candidate info display before & after result
*/

function displayCandidate(name: string, score?: number): string {
    if (score !== undefined) {
        return `candidate: ${name}, score: ${score}`;
    }
    return `candidate: ${name}`;
}

console.log(displayCandidate("Ahana"));
console.log(displayCandidate("Ahana", 88));


/* 
   8. arrow function with types
   scenario: auto calculate percentage
*/

const calculatePercentage = (marks: number, total: number): number => {
    return (marks / total) * 100;
};

let percentage = calculatePercentage(85, 100);
console.log("percentage:", percentage);


/* short arrow function
   scenario: pass or fail decision */

const passOrFail = (percent: number): string =>
    percent >= 40 ? "pass" : "fail";

console.log("result:", passOrFail(percentage));


/* 
   9. array of objects using interface
   scenario: active assessments list on dashboard
*/

interface Assessment {
    id: number;
    title: string;
    duration: number; // minutes
}

const assessments: Assessment[] = [
    { id: 1, title: "aptitude test", duration: 60 },
    { id: 2, title: "coding test", duration: 90 }
];

console.log("assessments available:");

assessments.forEach(test => {
    console.log(`- ${test.title} (${test.duration} mins)`);
});


/* 
   10. unknown vs any
   scenario: external API response
*/

let apiData: unknown = "Assessment Submitted Successfully";

//  not allowed directly
// console.log(apiData.toUpperCase());

if (typeof apiData === "string") {
    console.log("API Message:", apiData.toUpperCase());
}

/* why not use any? */

let unsafeData: any = 123;

// This will compile but crash in real apps
// unsafeData.toUpperCase(); dangerous

console.log("unsafe data:", unsafeData);
