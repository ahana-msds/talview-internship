"use strict";
/***************************************
 * TYPESCRIPT WITH FETCH
 * Scenario: Load assessments from API
 ***************************************/
const loadBtn = document.getElementById("loadBtn");
const testList = document.getElementById("testList");
loadBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        testList.innerHTML = ""; // clear old
        data.slice(0, 5).forEach(post => {
            const li = document.createElement("li");
            li.textContent = post.title;
            testList.appendChild(li);
        });
    }
    catch (error) {
        console.error("API Error:", error);
    }
});
