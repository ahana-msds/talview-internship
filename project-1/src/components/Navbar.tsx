import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../features/cart/cartSlice';
import { NavbarLogo } from './navbar/NavbarLogo';
import { NavbarUserInfo } from './navbar/NavbarUserInfo';
import { NavbarThemeSelector } from './navbar/NavbarThemeSelector';
import { NavbarLogout } from './navbar/NavbarLogout';
import { NavbarCartIcon } from './navbar/NavbarCartIcon';

export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (
        <nav className={styles.nav}>
            <NavbarLogo />
            <div className={styles.actions}>
                {user && (
                    <NavbarUserInfo displayName={user.displayName} />
                )}
                <NavbarThemeSelector
                    theme={theme}
                    onThemeChange={(newTheme) => setTheme(newTheme as any)}
                />

                {user && (
                    <NavbarLogout onLogout={handleLogout} />
                )}
                {user && (
                    <NavbarCartIcon
                        count={cartTotal}
                        onClick={() => navigate('/cart')}
                    />
                )}
            </div>
        </nav>
    );
};