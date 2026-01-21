
import React, { createContext, useState, useContext } from 'react';

// creating a context for theme with default 'light'
const ThemeContext = createContext();

// custom hook for consuming theme
export const useTheme = () => useContext(ThemeContext);

// provider component to wrap the app
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // toggles between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
