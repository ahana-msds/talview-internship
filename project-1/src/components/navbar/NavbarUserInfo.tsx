import styles from '../Navbar.module.css';

interface NavbarUserInfoProps {
    displayName?: string | null;
}

/**
 * NavbarUserInfo: Displays the currently logged-in user's name or 'Guest'.
 */
export const NavbarUserInfo = ({ displayName }: NavbarUserInfoProps) => {
    return (
        <span className={styles.userInfo}>
            Hi, {displayName || 'Guest'}
        </span>
    );
};
