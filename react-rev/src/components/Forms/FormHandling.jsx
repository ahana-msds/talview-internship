import React, { useState } from 'react';

/**
 * FormHandling Component
 * 
 * Chapter 7.2 & 7.3: Creating forms and handling submissions/input changes.
 */
const FormHandling = () => {
    // Using an object to manage multiple form fields (standard practice)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        department: 'Engineering',
        subscribe: false
    });

    const [submittedData, setSubmittedData] = useState(null);

    // Generic change handler for all input types
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Use functional update to ensure we have the latest state
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Stop page refresh
        console.log('Form Submitted:', formData);
        setSubmittedData({ ...formData });
    };

    return (
        <div className="demo-section">
            <h3>7.2 & 7.3. Form Handling and Submission</h3>

            <form onSubmit={handleSubmit} style={formStyle}>
                <div className="field">
                    <label>Username:</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        style={inputStyle}
                    />
                </div>

                <div className="field">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        style={inputStyle}
                    />
                </div>

                <div className="field">
                    <label>Department:</label>
                    <select name="department" value={formData.department} onChange={handleChange} style={inputStyle}>
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Marketing</option>
                    </select>
                </div>

                <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        name="subscribe"
                        checked={formData.subscribe}
                        onChange={handleChange}
                    />
                    <label>Subscribe to newsletter</label>
                </div>

                <button type="submit" style={submitBtnStyle}>Register User</button>
            </form>

            {submittedData && (
                <div style={resultStyle}>
                    <h4>Last Submitted Profile:</h4>
                    <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '8px'
};

const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    width: '100%',
    marginTop: '5px'
};

const submitBtnStyle = {
    padding: '10px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const resultStyle = {
    marginTop: '20px',
    padding: '15px',
    background: '#ecfdf5',
    border: '1px solid #10b981',
    borderRadius: '8px'
};

export default FormHandling;
