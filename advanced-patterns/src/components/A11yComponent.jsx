import React, { useState, useRef, useEffect } from 'react';
const A11yComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const triggerButtonRef = useRef(null);
    const firstInputRef = useRef(null);
    // Focus Management Pattern 1: Automatic Focus Return
    // When the modal closes, we MUST return focus to the element that opened it.
    useEffect(() => {
        if (!isModalOpen && triggerButtonRef.current) {
            triggerButtonRef.current.focus();
        }
    }, [isModalOpen]);
    // Focus Management Pattern 2: Initial Focus
    // When the modal opens, move focus to the first interactive element inside.
    useEffect(() => {
        if (isModalOpen && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [isModalOpen]);
    return (
        <section aria-labelledby="a11y-header" style={{ border: '2px solid #333', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <h2 id="a11y-header">Professional A11y: Focus Management</h2>
            <p>This demo shows how a <strong>Modal</strong> handles focus to prevent "Keyboard Traps".</p>
            <button
                ref={triggerButtonRef}
                onClick={() => setIsModalOpen(true)}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    outline: '3px solid transparent' // Placeholder for visible focus ring
                }}
                className="focusable-button"
            >
                Open Settings (Focus Trigger)
            </button>
            {isModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'white', padding: '40px', boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                        zIndex: 1000, borderRadius: '12px', border: '2px solid #007bff'
                    }}
                >
                    <h3 id="modal-title">Settings Modal</h3>
                    <p>Notice how your focus was automatically moved to the input below!</p>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="name-input" style={{ display: 'block', marginBottom: '5px' }}>Your Name:</label>
                        <input
                            id="name-input"
                            ref={firstInputRef}
                            type="text"
                            placeholder="Focused on open..."
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        style={{ background: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Close & Return Focus
                    </button>
                </div>
            )}
            {/* Backdrop for the modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999 }} />
            )}
            <style>{`
        .focusable-button:focus {
          outline: 4px solid #ffcc00 !important;
          box-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
        }
        input:focus {
          border-color: #007bff;
          outline: 3px solid rgba(0, 123, 255, 0.25);
        }
      `}</style>
        </section>
    );
};
export default A11yComponent;
