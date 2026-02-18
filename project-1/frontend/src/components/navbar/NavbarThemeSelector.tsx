import styles from '../Navbar.module.css';

interface NavbarThemeSelectorProps {
    theme: string;
    onThemeChange: (theme: string) => void;
}

/**
 * NavbarThemeSelector: Toggle between Light and Dark themes.
 */
export const NavbarThemeSelector = ({ theme, onThemeChange }: NavbarThemeSelectorProps) => {
    return (
        <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className={styles.themeSelect}
        >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
        </select>
    );
};
