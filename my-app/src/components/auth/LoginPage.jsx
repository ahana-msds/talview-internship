import React, { useState } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../config/firebase';

const LoginPage = ({ onLogin, onNavigateToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            onLogin(userCredential.user, 'email');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            onLogin(result.user, 'google');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGithubLogin = async () => {
        setError('');
        try {
            const provider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, provider);
            onLogin(result.user, 'github');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGuestLogin = () => {
        onLogin({ displayName: 'Guest User', email: 'guest@example.com' }, 'guest');
    };

    return (
        <div className="page-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Sign in to continue</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleEmailLogin}>
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    <button type="submit" className="btn btn-primary">Sign In</button>
                </form>

                <div className="divider">or continue with</div>

                <div className="social-buttons">
                    <button onClick={handleGoogleLogin} className="btn btn-secondary">
                        Google
                    </button>
                    <button onClick={handleGithubLogin} className="btn btn-secondary">
                        GitHub
                    </button>
                </div>

                <button onClick={handleGuestLogin} className="btn btn-outline">
                    Continue as Guest
                </button>

                <p className="link-text">
                    Don't have an account?
                    <button onClick={onNavigateToSignup} className="text-link">Sign Up</button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;