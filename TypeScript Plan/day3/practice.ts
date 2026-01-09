let candidateId: number = 1505;
let candidateEmail = "ahana.d@talview.com";

function registerCandidate(
    id: number,
    email: string,
    isPaid: boolean = false
): string {
    if (isPaid) {
        return "registered with payment";
    }
    return "registered for free test";
}

console.log(registerCandidate(candidateId, candidateEmail));
console.log(registerCandidate(candidateId, candidateEmail, true));
