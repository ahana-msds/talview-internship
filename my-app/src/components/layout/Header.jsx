import React from 'react';
import themes from '../../config/themes';

const Header = ({ theme, setTheme, showThemeMenu, setShowThemeMenu }) => {
    return (
        <header className="header">
            <h1>TaskFlow Hub</h1>
            <div className="theme-selector">
                <button
                    className="theme-button"
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                >
                    Theme ▾
                </button>
                {showThemeMenu && (
                    <div className="theme-menu">
                        {Object.entries(themes).map(([key, t]) => (
                            <button
                                key={key}
                                className={`theme-option ${theme === key ? 'active' : ''}`}
                                onClick={() => {
                                    setTheme(key);
                                    setShowThemeMenu(false);
                                }}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;