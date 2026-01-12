/**
 * TYPESCRIPT WITH FETCH
 * scenario: load assessments from API
 */

interface Post {
    id: number;
    title: string;
    body: string;
}

const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;
const testList = document.getElementById("testList") as HTMLUListElement;

loadBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data: Post[] = await response.json();

        testList.innerHTML = ""; // clear old

        data.slice(0, 5).forEach(post => {
            const li = document.createElement("li");
            li.textContent = post.title;
            testList.appendChild(li);
        });

    } catch (error) {
        console.error("API Error:", error);
    }
});
