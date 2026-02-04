import styles from '../Navbar.module.css';

interface NavbarLogoutProps {
    onLogout: () => void;
}

/**
 * NavbarLogout: A button component to trigger the logout process.
 */
export const NavbarLogout = ({ onLogout }: NavbarLogoutProps) => {
    return (
        <button
            onClick={onLogout}
            className={`btn btn-secondary ${styles.logoutBtn}`}
        >
            Logout
        </button>
    );
};
