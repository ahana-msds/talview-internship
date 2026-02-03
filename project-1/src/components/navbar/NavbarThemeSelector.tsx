import styles from '../Navbar.module.css';

interface NavbarThemeSelectorProps {
    theme: string;
    onThemeChange: (theme: string) => void;
}

export const NavbarThemeSelector = ({ theme, onThemeChange }: NavbarThemeSelectorProps) => {
    return (
        <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className={styles.themeSelect}
        >
            <option value="default">Minimal</option>
            <option value="ocean">Ocean</option>
            <option value="forest">Forest</option>
        </select>
    );
};
