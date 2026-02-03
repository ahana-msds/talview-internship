import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../features/cart/cartSlice';

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
                {user && (
                    <div style={{ position: 'relative', cursor: 'pointer', marginLeft: '15px' }} onClick={() => navigate('/cart')}>
                        <ShoppingCart size={24} />
                        {cartTotal > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'red',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 6px',
                                fontSize: '12px'
                            }}>
                                {cartTotal}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};