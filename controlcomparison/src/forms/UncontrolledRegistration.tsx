import { useRef, useState } from "react";

const UncontrolledRegistration = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const mealRef = useRef<HTMLSelectElement>(null);
    const [result, setResult] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const name = nameRef.current?.value;
        const meal = mealRef.current?.value;

        setResult(`registered: ${name} | meal: ${meal}`);
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "16px" }}>
            <h3>uncontrolled registration</h3>

            <form onSubmit={handleSubmit}>
                <input placeholder="enter name" ref={nameRef} />

                <select ref={mealRef}>
                    <option value="veg">veg</option>
                    <option value="non-veg">non-veg</option>
                </select>

                <button type="submit">register</button>
            </form>

            {result && <p>{result}</p>}
        </div>
    );
};

export default UncontrolledRegistration;
