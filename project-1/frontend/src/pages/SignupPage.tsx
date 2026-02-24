import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as Sentry from "@sentry/react";
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import styles from './Auth.module.css';

import { signupSchema } from '../lib/validation';

/**
 * SignupPage component handles new user registrations.
 * Users can create an account using their name, email, and password.
 */
export const SignupPage = () => {
    const { signupWithEmail } = useAuth();
    const navigate = useNavigate();

    // Local state for signup form inputs and UI state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the signup form submission.
     */
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // 1. Validate with Zod before proceeding
        const result = signupSchema.safeParse({ name, email, password: pass });

        if (!result.success) {
            // Get the first error message
            setError(result.error.issues[0].message);
            setIsLoading(false);
            return;
        }

        try {
            await signupWithEmail(name, email, pass);
            console.log('Signup successful, navigating to login...');
            navigate('/login');
        } catch (err: any) {
            console.error('Signup error caught in SignupPage:', err);
            Sentry.captureException(err);
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <Navbar />
            <div className={`container ${styles.pageContainer}`}>
                <div className={`card ${styles.authCard}`}>
                    <h2 className={styles.title}>Create Account</h2>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleSignup} className={styles.form}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
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
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                    <div className={styles.footer}>
                        Already have an account? <Link to="/login" className={styles.link}>Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
};