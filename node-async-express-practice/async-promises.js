/**
 * PROMISES: A more readable alternative to callbacks.
 */

const getTask = (isSuccessful) => {
    return new Promise((resolve, reject) => {
        console.log("--- Task Started ---");
        setTimeout(() => {
            if (isSuccessful) {
                resolve({ status: "Complete", code: 200 });
            } else {
                reject(new Error("Database Connection Failed"));
            }
        }, 1500);
    });
};

console.log("Initiating Promise chain...");

getTask(true)
    .then((result) => {
        console.log("1. First Promise Resolved:", result);
        return getTask(true); // Return another promise for chaining
    })
    .then((result) => console.log("2. Second Promise Resolved:", result))
    .catch((error) => console.error("Caught error:", error.message))
    .finally(() => console.log("--- Lab Finished ---"));
