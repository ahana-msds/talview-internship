import React, { useRef } from "react";

export default function InputFocusDemo() {
    const inputRef = useRef(null);

    const focusInput = () => {
        // direct dom access
        inputRef.current.focus();
    };

    return (
        <>
            <input ref={inputRef} />
            <button onClick={focusInput}>focus</button>
        </>
    );
}
