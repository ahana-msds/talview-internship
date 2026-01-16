import React, { useRef } from "react";

const UncontrolledUpdateForm: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(inputRef.current?.value);
    };

    return (
        <form onSubmit={submit}>
            <h4>uncontrolled form</h4>
            <input ref={inputRef} />
            <button>submit</button>
        </form>
    );
};

export default UncontrolledUpdateForm;
