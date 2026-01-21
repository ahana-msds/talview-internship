
import React, { useRef, useEffect } from 'react';

const AccessibleForm = () => {
    const firstInputRef = useRef(null);

    // automatically focus the first input on mount for better a11y (if appropriate context)
    useEffect(() => {
        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, []);

    return (
        <form
            style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}
            onSubmit={(e) => { e.preventDefault(); alert('form submitted'); }}
        >
            <h3>Accessible Form</h3>

            {/* associating label with input via htmlFor and id */}
            <label htmlFor="username">username:</label>
            <input
                id="username"
                ref={firstInputRef}
                type="text"
                aria-required="true"
                placeholder="enter your username"
            />

            <label htmlFor="email">email:</label>
            <input
                id="email"
                type="email"
                aria-details="email-help"
            />
            <small id="email-help">we will not share your email.</small>

            <button type="submit" aria-label="submit registration form">
                register
            </button>
        </form>
    );
};

export default AccessibleForm;
