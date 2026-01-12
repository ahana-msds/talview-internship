var candidateId = 1505;
var candidateEmail = "ahana.d@talview.com";
function registerCandidate(id, email, isPaid) {
    if (isPaid === void 0) { isPaid = false; }
    if (isPaid) {
        return "registered with payment";
    }
    return "registered for free test";
}
console.log(registerCandidate(candidateId, candidateEmail));
console.log(registerCandidate(candidateId, candidateEmail, true));
