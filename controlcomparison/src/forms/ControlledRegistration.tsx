import { useState } from "react";

const ControlledRegistration = () => {
    const [name, setName] = useState("");
    const [meal, setMeal] = useState("veg");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "16px" }}>
            <h3>controlled registration</h3>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select value={meal} onChange={(e) => setMeal(e.target.value)}>
                    <option value="veg">veg</option>
                    <option value="non-veg">non-veg</option>
                </select>

                <button type="submit">register</button>
            </form>

            {submitted && (
                <p>
                    registered: {name} | meal: {meal}
                </p>
            )}
        </div>
    );
};

export default ControlledRegistration;
