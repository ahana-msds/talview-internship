import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as Sentry from "@sentry/react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import styles from './Auth.module.css';

import { loginSchema } from '../lib/validation';

/**
 * LoginPage component handles user authentication.
 * It provides options for email/password login, social logins (Google, GitHub), and guest access.
 */
export const LoginPage = () => {
    const { loginWithEmail, loginWithGoogle, loginWithGithub, loginAsGuest } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as any)?.from || '/dashboard';

    // Local state for form inputs and loading status
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles authentication using email and password.
     */
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // 1. Validate with Zod
        const result = loginSchema.safeParse({ email, password: pass });

        if (!result.success) {
            setError(result.error.issues[0].message);
            setIsLoading(false);
            return;
        }

        try {
            await loginWithEmail(email, pass);
            navigate(redirectTo);
        } catch (err: any) {
            Sentry.captureException(err);
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles social and guest login methods.
     * @param method - The login method to use.
     */
    const handleSocialLogin = async (method: 'google' | 'github' | 'guest') => {
        setIsLoading(true);
        setError('');
        try {
            if (method === 'google') await loginWithGoogle();
            if (method === 'github') await loginWithGithub();
            if (method === 'guest') await loginAsGuest();
            navigate(redirectTo);
        } catch (err) {
            Sentry.captureException(err);
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <Navbar />
            <div className={`container ${styles.pageContainer}`}>
                <div className={`card ${styles.authCard}`}>
                    <h2 className={styles.title}>Login</h2>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleEmailLogin} className={styles.form}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className={styles.separator}>OR</div>
                    <div className={styles.socials}>
                        <button onClick={() => handleSocialLogin('google')} className="btn btn-secondary" disabled={isLoading}>
                            Sign in with Google
                        </button>
                        <button onClick={() => handleSocialLogin('github')} className="btn btn-secondary" disabled={isLoading}>
                            Sign in with GitHub
                        </button>
                        <button onClick={() => handleSocialLogin('guest')} className={`btn btn-secondary ${styles.guestBtn}`} disabled={isLoading}>
                            Continue as Guest
                        </button>
                    </div>
                    <div className={styles.footer}>
                        Need an account? <Link to="/signup" className={styles.link}>Sign Up</Link>
                    </div>
                    {email === 'admin@example.com' && (
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                            Tip: If this is your first time, please <b>Sign Up</b> as admin@example.com with password 'Admin@123' first.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};