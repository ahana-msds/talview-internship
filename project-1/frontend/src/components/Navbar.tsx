// Custom hooks for Theme and Auth contexts
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
// Navigation and Styling
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
// Redux for cart status
import { useSelector } from 'react-redux';
import { selectCartItems } from '../features/cart/cartSlice';

// Navbar sub-components for modularity
import { NavbarLogo } from './navbar/NavbarLogo';
import { NavbarUserInfo } from './navbar/NavbarUserInfo';
import { NavbarThemeSelector } from './navbar/NavbarThemeSelector';
import { NavbarLogout } from './navbar/NavbarLogout';
import { NavbarCartIcon } from './navbar/NavbarCartIcon';

/**
 * Navbar: The primary navigation bar for the application.
 * Dynamically renders user info, theme selector, cart icon, and logout button based on auth state.
 */
export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    // Calculate total item count in cart for the badge
    const cartItems = useSelector(selectCartItems);
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity, 0);

    /**
     * handleLogout: Executes logout logic and redirects to the login page.
     */
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (
        <nav className={styles.nav}>
            <NavbarLogo />
            <div className={styles.actions}>
                {user && !isAuthPage && (
                    <NavbarUserInfo displayName={user.displayName} />
                )}
                <NavbarThemeSelector
                    theme={theme}
                    onThemeChange={(newTheme) => setTheme(newTheme as any)}
                />

                {user && !isAuthPage && (
                    <NavbarLogout onLogout={handleLogout} />
                )}
                {user && !isAuthPage && (
                    <NavbarCartIcon
                        count={cartTotal}
                        onClick={() => navigate('/cart')}
                    />
                )}
            </div>
        </nav>
    );
};