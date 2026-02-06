import React from 'react';
import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom';

/**
 * DynamicRouting Component
 * 
 * Chapter 8.3: Using dynamic routes and parameters.
 */

const UserProfile = () => {
    // useParams() hook extracts the dynamic segments from the URL
    const { userId } = useParams();
    const location = useLocation();

    return (
        <div style={profileStyle}>
            <h4>User Profile</h4>
            <p>Viewing data for User ID: <strong style={{ color: '#ec4899' }}>{userId}</strong></p>
            <p style={{ fontSize: '0.8em', color: '#666' }}>Current Path: {location.pathname}</p>
        </div>
    );
};

const DynamicRouting = () => {
    return (
        <div className="demo-section">
            <h3>8.3. Dynamic Routes and Parameters</h3>

            <div style={{ marginBottom: '15px' }}>
                <p>Click links to pass different IDs to the same component:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="user/101" style={btnLinkStyle}>User 101</Link>
                    <Link to="user/202" style={btnLinkStyle}>User 202</Link>
                    <Link to="user/999" style={btnLinkStyle}>User 999</Link>
                </div>
            </div>

            <div style={displayAreaStyle}>
                <Routes>
                    {/* :userId is a dynamic param */}
                    <Route path="user/:userId" element={<UserProfile />} />
                    <Route path="*" element={<p>Select a user above to see dynamic routing in action.</p>} />
                </Routes>
            </div>

            <div style={{ marginTop: '20px', background: '#fef2f2', padding: '10px', borderRadius: '4px', fontSize: '0.85em' }}>
                <strong>How it works:</strong> The route is defined as <code>/user/:userId</code>. React Router matches any value in that position and makes it available via the <code>useParams()</code> hook inside the <code>UserProfile</code> component.
            </div>
        </div>
    );
};

const btnLinkStyle = {
    padding: '6px 12px',
    background: '#ec4899',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9em'
};

const profileStyle = {
    padding: '15px',
    background: '#fdf2f8',
    border: '1px solid #f9a8d4',
    borderRadius: '8px'
};

const displayAreaStyle = {
    minHeight: '100px',
    border: '1px dashed #ccc',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
};

export default DynamicRouting;
