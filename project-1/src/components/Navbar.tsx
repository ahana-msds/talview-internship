import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                Project App
            </div>
            <div className={styles.actions}>
                {user && (
                    <span className={styles.userInfo}>
                        Hi, {user.displayName || 'Guest'}
                    </span>
                )}
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className={styles.themeSelect}
                >
                    <option value="default">Minimal</option>
                    <option value="ocean">Ocean</option>
                    <option value="forest">Forest</option>
                </select>

                {user && (
                    <button
                        onClick={handleLogout}
                        className={`btn btn-secondary ${styles.logoutBtn}`}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};