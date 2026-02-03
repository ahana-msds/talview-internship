import styles from '../Navbar.module.css';

interface NavbarUserInfoProps {
    displayName?: string | null;
}

export const NavbarUserInfo = ({ displayName }: NavbarUserInfoProps) => {
    return (
        <span className={styles.userInfo}>
            Hi, {displayName || 'Guest'}
        </span>
    );
};
