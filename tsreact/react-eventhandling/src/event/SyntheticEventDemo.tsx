const SyntheticEventDemo = () => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("event type:", e.type);
        console.log("target:", e.target);
        console.log("current target:", e.currentTarget);
    };

    return (
        <div style={{ border: "1px solid gray", padding: "16px", marginBottom: "12px" }}>
            <h3>synthetic event demo</h3>
            <button onClick={handleClick}>click me</button>
        </div>
    );
};

export default SyntheticEventDemo;
