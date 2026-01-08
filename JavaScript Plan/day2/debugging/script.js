function checkScore() {

    try {

        debugger; // 🔴 browser will pause here

        const input = document.getElementById("scoreInput").value;
        const score = Number(input);

        if (input === "") {
            throw new Error("score is required");
        }

        if (isNaN(score)) {
            throw new Error("score must be a number");
        }

        if (score < 0 || score > 100) {
            throw new Error("score must be between 0 and 100");
        }

        let result;

        if (score >= 75) {
            result = "selected";
        } else {
            result = "rejected";
        }

        document.getElementById("result").innerText = result;

    } catch (err) {

        console.error("error:", err.message);
        document.getElementById("result").innerText = err.message;

    } finally {

        console.log("validation completed");
    }
}
