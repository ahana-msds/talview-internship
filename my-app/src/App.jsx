import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import themes from './config/themes';
import Header from './components/layout/Header';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Dashboard from './components/dashboard/Dashboard';
import './styles/App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loginMethod, setLoginMethod] = useState('');
  const [theme, setTheme] = useState('hm');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const currentTheme = themes[theme];

  const handleLogin = (userData, method) => {
    setUser(userData);
    setLoginMethod(method);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    if (loginMethod !== 'guest') {
      await signOut(auth);
    }
    setUser(null);
    setLoginMethod('');
    setCurrentPage('login');
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', currentTheme.primary);
    document.documentElement.style.setProperty('--secondary-color', currentTheme.secondary);
    document.documentElement.style.setProperty('--background-color', currentTheme.background);
    document.documentElement.style.setProperty('--card-bg', currentTheme.cardBg);
    document.documentElement.style.setProperty('--text-color', currentTheme.text);
    document.documentElement.style.setProperty('--border-color', currentTheme.border);
  }, [theme]);

  return (
    <div className="app">
      <Header
        theme={theme}
        setTheme={setTheme}
        showThemeMenu={showThemeMenu}
        setShowThemeMenu={setShowThemeMenu}
      />

      <main className="main-content">
        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={() => setCurrentPage('signup')}
          />
        )}
        {currentPage === 'signup' && (
          <SignupPage
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        )}
        {currentPage === 'dashboard' && (
          <Dashboard
            user={user}
            loginMethod={loginMethod}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
};

export default App;