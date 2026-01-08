function grade(score) {
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    return "C";
}
function test(desc, expected, actual) {
    if (expected === actual) {
        console.log("PASS:", desc);
    } else {
        console.error("FAIL:", desc, "| expected:", expected, "got:", actual);
    }
}

test("Top performer", "A", grade(90));
test("Mid performer", "B", grade(75));
test("Low performer", "C", grade(60));
