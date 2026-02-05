import React, { useState } from 'react';

/**
 * preventDefault Demo
 * 
 * Browsers have default behaviors for some elements (e.g., form submission reloads page, link clicks navigate).
 * e.preventDefault() stops these default actions.
 */
const PreventDefaultDemo = () => {
    const [formStatus, setFormStatus] = useState('Ready to submit');

    const handleSubmit = (event) => {
        // Stop the browser from refreshing the page
        event.preventDefault();

        setFormStatus('Form submitted! (Page was NOT refreshed thanks to preventDefault)');

        // In a real app, you would handle the data here (e.g., send to API)
        setTimeout(() => setFormStatus('Ready to submit'), 3000);
    };

    const handleLinkClick = (event) => {
        // Stop the link from actually navigating
        event.preventDefault();
        alert('Navigation stopped! preventDefault was called.');
    };

    return (
        <div style={{ border: '2px solid #0891b2', padding: '20px', borderRadius: '8px', margin: '10px' }}>
            <h2>6.4. preventDefault Method</h2>

            <div style={{ marginBottom: '20px' }}>
                <h4>Example 1: Form Submission</h4>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Type something..."
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        type="submit"
                        style={{ padding: '8px', backgroundColor: '#0891b2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Submit Form
                    </button>
                </form>
                <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#0e7490' }}>{formStatus}</p>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

            <div>
                <h4>Example 2: Link Navigation</h4>
                <a
                    href="https://react.dev"
                    onClick={handleLinkClick}
                    style={{ color: '#0891b2', fontWeight: 'bold' }}
                >
                    Clicking this won't open React.dev
                </a>
            </div>
        </div>
    );
};

export default PreventDefaultDemo;
