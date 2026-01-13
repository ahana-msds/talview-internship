import { useState, useMemo, useCallback } from "react";
import Button from "./components/Button";
import Student from "./components/Student";

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // expensive calculation
  function slowCalculation(num: number) {
    console.log("slow calculation running...");
    let total = 0;
    for (let i = 0; i < 500_000_000; i++) {
      total += num;
    }
    return total;
  }

  // useMemo prevents recalculation unless count changes
  const result = useMemo(() => {
    return slowCalculation(count);
  }, [count]);

  // useCallback prevents new function creation on each render
  const handleClick = useCallback(() => {
    console.log("child button clicked");
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>memoization demo</h2>

      <p>result from slow calculation: {result}</p>

      <button onClick={() => setCount(count + 1)}>increase count</button>

      <br /><br />

      <input
        placeholder="type here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <Button onClick={handleClick} />

      <Student name="ahana" />
    </div>
  );
}

export default App;
