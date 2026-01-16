import React, { useState } from "react";
import styles from "../../styles/form.module.css";

const ControlledUpdateForm: React.FC = () => {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("title required");
            return;
        }

        alert(`submitted: ${title}`);
        setTitle("");
        setError("");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h4>controlled form</h4>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            {error && <span className={styles.error}>{error}</span>}
            <button type="submit">add</button>
        </form>
    );
};

export default ControlledUpdateForm;
