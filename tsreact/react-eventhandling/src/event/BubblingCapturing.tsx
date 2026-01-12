const BubblingCapturing = () => {
    const handleParentClick = () => {
        console.log("parent clicked");
    };

    const handleChildClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("child clicked");
        // e.stopPropagation(); // uncomment to stop bubbling
    };

    return (
        <div
            onClick={handleParentClick}
            style={{
                border: "2px solid blue",
                padding: "20px",
                marginBottom: "12px"
            }}
        >
            <h3>event bubbling demo</h3>
            <button onClick={handleChildClick}>child button</button>
        </div>
    );
};

export default BubblingCapturing;
