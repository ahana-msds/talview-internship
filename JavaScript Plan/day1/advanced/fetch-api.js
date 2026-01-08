async function getAssessmentData() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users/1");

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        console.log("candidate data:", data);

    } catch (err) {
        console.error("fetch error:", err.message);
    }
}

getAssessmentData();
