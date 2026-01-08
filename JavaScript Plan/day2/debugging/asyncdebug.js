async function fetchCandidate(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    console.log("Status:", res.status); // debug info

    if (!res.ok) throw new Error("Candidate not found");

    return res.json();
}

fetchCandidate(999)
    .then(data => console.log(data))
    .catch(err => console.error("API Failed:", err.message));
