/** context: online assessment platform  */
/*
   1. typed variables
   scenario: test session information
*/
var testDuration = 60; // minutes
var candidateName = "Ahana Das";
var hasCameraPermission = true;
console.log("session info:", testDuration, candidateName, hasCameraPermission);
/*
   2. typed function
   scenario: display greeting on dashboard
*/
function generateGreeting(name) {
    return "Welcome to your assessment, ".concat(name);
}
console.log(generateGreeting(candidateName));
var candidate1 = {
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
var sectionScores = [18, 22, 25];
sectionScores.push(30);
// sectionScores.push("40");  not allowed
console.log("section scores:", sectionScores);
/*
   5. union types
   scenario: assessment ID from backend
*/
var assessmentId;
assessmentId = 5043;
assessmentId = "TEMP-5043";
console.log("assessment ID:", assessmentId);
var uploadStatus = "processing";
console.log("upload status:", uploadStatus);
/*
   7. optional parameter in function
   scenario: candidate info display before & after result
*/
function displayCandidate(name, score) {
    if (score !== undefined) {
        return "candidate: ".concat(name, ", score: ").concat(score);
    }
    return "candidate: ".concat(name);
}
console.log(displayCandidate("Ahana"));
console.log(displayCandidate("Ahana", 88));
/*
   8. arrow function with types
   scenario: auto calculate percentage
*/
var calculatePercentage = function (marks, total) {
    return (marks / total) * 100;
};
var percentage = calculatePercentage(85, 100);
console.log("percentage:", percentage);
/* short arrow function
   scenario: pass or fail decision */
var passOrFail = function (percent) {
    return percent >= 40 ? "pass" : "fail";
};
console.log("result:", passOrFail(percentage));
var assessments = [
    { id: 1, title: "aptitude test", duration: 60 },
    { id: 2, title: "coding test", duration: 90 }
];
console.log("assessments available:");
assessments.forEach(function (test) {
    console.log("- ".concat(test.title, " (").concat(test.duration, " mins)"));
});
/*
   10. unknown vs any
   scenario: external API response
*/
var apiData = "Assessment Submitted Successfully";
//  not allowed directly
// console.log(apiData.toUpperCase());
if (typeof apiData === "string") {
    console.log("API Message:", apiData.toUpperCase());
}
/* why not use any? */
var unsafeData = 123;
// This will compile but crash in real apps
// unsafeData.toUpperCase(); dangerous
console.log("unsafe data:", unsafeData);
