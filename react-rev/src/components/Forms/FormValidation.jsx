import React, { useState } from 'react';

/**
 * FormValidation Component
 * 
 * Chapter 7.4: Validation of form data.
 */
const FormValidation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            alert("Form is valid! Submitting...");
            // Proceed with API call
        }
    };

    return (
        <div className="demo-section">
            <h3>7.4. Form Validation</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="field">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : '#cbd5e1' }}
                    />
                    {errors.email && <span style={errorLabelStyle}>{errors.email}</span>}
                </div>

                <div className="field">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ ...inputStyle, borderColor: errors.password ? '#ef4444' : '#cbd5e1' }}
                    />
                    {errors.password && <span style={errorLabelStyle}>{errors.password}</span>}
                </div>

                <button type="submit" style={btnStyle}>Login</button>
            </form>

            <div style={{ marginTop: '15px', background: '#fffbeb', padding: '10px', borderRadius: '4px', border: '1px solid #f59e0b', fontSize: '0.85em' }}>
                <strong>Logic Explained:</strong> Validation occurs in the <code>validate()</code> function before the form is submitted. Errors are stored in state and used to toggle red borders and error messages.
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid',
    width: '100%',
    marginTop: '5px'
};

const errorLabelStyle = {
    color: '#ef4444',
    fontSize: '0.8em',
    marginTop: '4px',
    display: 'block'
};

const btnStyle = {
    padding: '10px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default FormValidation;
