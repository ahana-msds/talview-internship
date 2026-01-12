const PreventDefaultDemo = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("form submitted without page reload");
    };

    return (
        <div style={{ border: "1px solid gray", padding: "16px", marginBottom: "12px" }}>
            <h3>prevent default demo</h3>
            <form onSubmit={handleSubmit}>
                <input placeholder="username" />
                <button type="submit">submit</button>
            </form>
        </div>
    );
};

export default PreventDefaultDemo;
