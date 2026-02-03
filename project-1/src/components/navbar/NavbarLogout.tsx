import styles from '../Navbar.module.css';

interface NavbarLogoutProps {
    onLogout: () => void;
}

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
