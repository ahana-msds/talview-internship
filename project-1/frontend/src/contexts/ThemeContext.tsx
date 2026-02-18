// React context and effect hooks
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Supported themes in the application
type Theme = 'light' | 'dark';

/**
 * Interface for Theme Context.
 */
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider: Manages and persists the application's visual theme.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Initialize theme from localStorage if exists, default to 'light'
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return (savedTheme === 'dark' ? 'dark' : 'light');
    });

    // Effect to apply theme classes and persist selection
    useEffect(() => {
        // Persist theme choice in localStorage
        localStorage.setItem('app-theme', theme);

        // Remove all previous theme classes from body
        document.body.classList.remove('theme-dark');

        // Apply dark theme class
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom hook to easily access and modify the theme state.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};