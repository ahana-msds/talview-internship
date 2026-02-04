import styles from '../Navbar.module.css';

interface NavbarThemeSelectorProps {
    theme: string;
    onThemeChange: (theme: string) => void;
}

/**
 * NavbarThemeSelector: Dropdown component for choosing the application's theme.
 */
export const NavbarThemeSelector = ({ theme, onThemeChange }: NavbarThemeSelectorProps) => {
    return (
        <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className={styles.themeSelect}
        >
            {/* Theme options with descriptive emojis */}
            <option value="default">✨ Minimal</option>
            <option value="ocean">🌊 Ocean</option>
            <option value="forest">🌲 Forest</option>
        </select>
    );
};
