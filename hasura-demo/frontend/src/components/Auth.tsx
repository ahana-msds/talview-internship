import React, { useState, useEffect } from 'react';

export const Auth: React.FC = () => {
    const [role, setRole] = useState(localStorage.getItem('role') || 'user');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '1');

    useEffect(() => {
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        // Reload to apply new headers to Apollo Client
        // In a real app, this would be handled via Context or Redux without full reload
    }, [role, userId]);

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        window.location.reload();
    };

    const handleUserChange = (newId: string) => {
        setUserId(newId);
        window.location.reload();
    };

    return (
        <div style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
            <h3>Authentication Simulator</h3>
            <p>Simulate different users and roles to test Access Control.</p>

            <div>
                <label>Role: </label>
                <select value={role} onChange={(e) => handleRoleChange(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
                <label>User ID: </label>
                <select value={userId} onChange={(e) => handleUserChange(e.target.value)}>
                    <option value="1">User 1 (Admin)</option>
                    <option value="2">User 2 (Regular)</option>
                    <option value="3">User 3 (Guest)</option>
                </select>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#666' }}>
                Current Context: Role=<b>{role}</b>, UserID=<b>{userId}</b>
            </p>
        </div>
    );
};
