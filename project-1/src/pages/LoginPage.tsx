import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import styles from './Auth.module.css';
export const LoginPage = () => {
    const { loginWithEmail, loginWithGoogle, loginWithGithub, loginAsGuest } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await loginWithEmail(email, pass);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };
    const handleSocialLogin = async (method: 'google' | 'github' | 'guest') => {
        setIsLoading(true);
        setError('');
        try {
            if (method === 'google') await loginWithGoogle();
            if (method === 'github') await loginWithGithub();
            if (method === 'guest') await loginAsGuest();
            navigate('/dashboard');
        } catch (err) {
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
                </div>
            </div>
        </>
    );
};