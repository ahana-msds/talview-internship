import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
type Theme = 'default' | 'ocean' | 'forest';
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return (savedTheme as Theme) || 'default';
    });

    useEffect(() => {
        // Persist theme choice
        localStorage.setItem('app-theme', theme);

        // Remove all theme classes first
        document.body.classList.remove('theme-ocean', 'theme-forest');

        // Add specific theme class if not default
        if (theme === 'ocean') {
            document.body.classList.add('theme-ocean');
        } else if (theme === 'forest') {
            document.body.classList.add('theme-forest');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};