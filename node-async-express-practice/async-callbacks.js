/**
 * CALLBACKS: Passing a function to be executed after another function finishes.
 */

console.log("1. Starting Task...");

function fetchData(callback) {
    console.log("2. Data fetch initiated...");
    setTimeout(() => {
        const data = { id: 1, name: "Ahana" };
        console.log("3. Data fetch completed (after 2s delay)");
        callback(data); // Executing the callback with data
    }, 2000);
}

fetchData((result) => {
    console.log("4. Handling result in callback:", result);
});

console.log("5. End of script (notice this runs BEFORE the callback results!)");
