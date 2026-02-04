// React context and effect hooks
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Supported themes in the application
type Theme = 'default' | 'ocean' | 'forest';

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
    // Initialize theme from localStorage if exists, default to 'default'
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return (savedTheme as Theme) || 'default';
    });

    // Effect to apply theme classes and persist selection
    useEffect(() => {
        // Persist theme choice in localStorage
        localStorage.setItem('app-theme', theme);

        // Remove all previous theme classes from body
        document.body.classList.remove('theme-ocean', 'theme-forest');

        // Apply selected theme class if it's not the default minimal theme
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