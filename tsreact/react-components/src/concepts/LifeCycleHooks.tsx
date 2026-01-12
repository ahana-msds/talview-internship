import { useEffect, useState } from "react";

function LifecycleHooks() {

    const [courses, setCourses] = useState<string[]>([]);

    // Runs when component loads
    useEffect(() => {

        console.log("Fetching course list...");

        // Simulating API call
        setTimeout(() => {
            setCourses(["ML", "Data Science", "Cloud Computing"]);
        }, 1000);

        // Cleanup runs when component unmounts
        return () => {
            console.log("Course dashboard closed");
        };

    }, []);

    return (
        <div>

            <h3>Course List (Lifecycle)</h3>

            {courses.map((c, i) => (
                <p key={i}>{c}</p>
            ))}

        </div>
    );
}

export default LifecycleHooks;
