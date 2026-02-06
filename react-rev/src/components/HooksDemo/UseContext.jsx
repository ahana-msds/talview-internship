import React, { createContext, useContext, useState } from 'react';

/**
 * Theme Context
 * createContext provides a way to pass data through the component tree 
 * without having to pass props down manually at every level.
 */
const ThemeContext = createContext();

const ThemeDisplay = () => {
    // Use the context in a child component deep in the tree
    const { theme, toggleTheme } = useContext(ThemeContext);

    const style = {
        padding: '20px',
        borderRadius: '8px',
        marginTop: '10px',
        backgroundColor: theme === 'light' ? '#fff' : '#1e293b',
        color: theme === 'light' ? '#1e293b' : '#fff',
        border: '1px solid #ccc'
    };

    return (
        <div style={style}>
            <p>The current theme is: <strong>{theme}</strong></p>
            <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
    );
};

const UseContext = () => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="hook-demo-box">
            <h3>useContext Hook</h3>
            <p>Avoids "Prop Drilling" by sharing data globally (Theme, User, Auth).</p>

            {/* Provide the context value to the subtree */}
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <ThemeDisplay />
            </ThemeContext.Provider>
        </div>
    );
};

export default UseContext;
