/**
 * ASYNC/AWAIT: Looking synchronous, performing asynchronously.
 */

const mockApi = () => {
    return new Promise(resolve => setTimeout(() => resolve("API Content Received"), 1000));
};

async function main() {
    console.log("Starting async sequence...");

    try {
        console.log("Step 1: Wait for API...");
        const content = await mockApi(); // Logic stops here until Promise is settled
        console.log("Step 2: Process ", content);

        console.log("Step 3: Sequential step...");
        const result = await mockApi();
        console.log("Step 4: All done: ", result);
    } catch (err) {
        console.error("Oops:", err);
    }
}

main();
console.log("Script continues while main() is awaiting...");
