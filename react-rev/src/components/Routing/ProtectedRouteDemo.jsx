import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRouteDemo Component
 * 
 * Chapter: Protecting routes with authentication.
 */

// Simulated Authentication Service
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
    return { isAuthenticated, login, logout };
};

// A Wrapper Component for Protected Routes
const ProtectedRoute = ({ isAuth, children }) => {
    if (!isAuth) {
        // Redirect to "login" if not authenticated
        return <Navigate to="../login" replace />;
    }
    return children;
};

const Dashboard = () => (
    <div style={secretStyle}>
        <h4>🔒 Secure Dashboard</h4>
        <p>This content is ONLY visible to authenticated users.</p>
    </div>
);

const Login = ({ onLogin }) => (
    <div style={loginStyle}>
        <h4>Login Required</h4>
        <p>Please log in to access the secure area.</p>
        <button onClick={onLogin} style={loginBtnStyle}>Log In Now</button>
    </div>
);

const ProtectedRouteDemo = () => {
    const { isAuthenticated, login, logout } = useAuth();

    return (
        <div className="demo-section">
            <h3>8.4. Protected Routes and Authentication</h3>

            <div style={statusBarStyle}>
                Status: <strong>{isAuthenticated ? "Logged In ✅" : "Logged Out ❌"}</strong>
                {isAuthenticated && <button onClick={logout} style={logoutBtnStyle}>Logout</button>}
            </div>

            <nav style={{ margin: '15px 0', display: 'flex', gap: '15px' }}>
                <Link to="login">Login Page</Link>
                <Link to="dashboard">Secure Dashboard (Try clicking!)</Link>
            </nav>

            <div style={routeDisplayStyle}>
                <Routes>
                    <Route path="login" element={<Login onLogin={login} />} />
                    <Route
                        path="dashboard"
                        element={
                            <ProtectedRoute isAuth={isAuthenticated}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<p>Select a route from the links above.</p>} />
                </Routes>
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
                <strong>Mechanism:</strong> The <code>ProtectedRoute</code> component checks the <code>isAuth</code> status. If false, it uses <code>Navigate</code> to redirect the user to the login route before they can even see the dashboard.
            </div>
        </div>
    );
};

const statusBarStyle = {
    padding: '10px',
    background: '#f1f5f9',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const secretStyle = {
    padding: '20px',
    background: '#ecfdf5',
    border: '2px solid #10b981',
    borderRadius: '8px',
    color: '#064e3b'
};

const loginStyle = {
    padding: '20px',
    background: '#fff7ed',
    border: '2px solid #f59e0b',
    borderRadius: '8px'
};

const loginBtnStyle = {
    padding: '8px 16px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const logoutBtnStyle = {
    padding: '4px 8px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8em'
};

const routeDisplayStyle = {
    minHeight: '150px',
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px'
};

export default ProtectedRouteDemo;
