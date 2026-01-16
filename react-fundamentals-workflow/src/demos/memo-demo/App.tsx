import { useState } from "react";
import ExpensiveChild from "./ExpensiveChild";

export default function App() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>
                Increment Count
            </button>

            <input
                placeholder="Type something"
                onChange={(e) => setText(e.target.value)}
            />

            <ExpensiveChild value={count} />
        </div>
    );
}
