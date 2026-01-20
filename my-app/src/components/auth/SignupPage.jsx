import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

const SignupPage = ({ onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                onNavigateToLogin();
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="subtitle">Join us today</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                        minLength={6}
                    />
                    <button type="submit" className="btn btn-primary">Create Account</button>
                </form>

                <p className="link-text">
                    Already have an account?
                    <button onClick={onNavigateToLogin} className="text-link">Sign In</button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;