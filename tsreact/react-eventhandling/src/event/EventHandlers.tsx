import { useState } from "react";

const EventHandlers = () => {
    const [count, setCount] = useState<number>(0);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    return (
        <div style={{ border: "1px solid gray", padding: "16px", marginBottom: "12px" }}>
            <h3>basic event handler</h3>
            <p>count: {count}</p>
            <button onClick={handleIncrement}>increment</button>
        </div>
    );
};

export default EventHandlers;
