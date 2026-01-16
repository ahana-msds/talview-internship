import { useState, useEffect } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Count updated:", count);
    }, [count]);

    return (
        <div>
            <p>Current Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
