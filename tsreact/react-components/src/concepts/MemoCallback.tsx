import { useCallback, useMemo, useState } from "react";

function MemoCallback() {

    const [search, setSearch] = useState("");

    const courses = [
        "AI",
        "ML",
        "Data Science",
        "Cloud",
        "Cyber Security"
    ];

    // Expensive filtering operation
    const filteredCourses = useMemo(() => {

        console.log("Filtering courses...");

        return courses.filter(c =>
            c.toLowerCase().includes(search.toLowerCase())
        );

    }, [search]);

    // Memoized button handler
    const handleRegister = useCallback(() => {
        alert("Student registered!");
    }, []);

    return (
        <div>

            <h3>Course Search (Performance)</h3>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search course"
            />

            {filteredCourses.map((c, i) => (
                <p key={i}>{c}</p>
            ))}

            <button onClick={handleRegister}>
                Register
            </button>

        </div>
    );
}

export default MemoCallback;
