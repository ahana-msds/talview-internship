import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from './features/ui/uiSlice';
import PostList from './components/PostList';
import { Sun, Moon, Database, Layout as LayoutIcon, Github } from 'lucide-react';

const App = () => {
  const { darkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
            <Database size={24} color="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Redux Mastery</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LayoutIcon size={20} className="text-primary" />
            <span>Dashboard</span>
          </div>
        </nav>

        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => dispatch(toggleDarkMode())}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>State Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>Practicing Redux Toolkit & RTK Query for scalable React apps.</p>
          </div>
          <div className="badge">v1.0.0</div>
        </header>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <h2>Server State (RTK Query)</h2>
            <div style={{ height: '1px', flex: 1, background: 'var(--border-dark)' }}></div>
          </div>
          <PostList />
        </section>

        <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--border-dark)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <p>© 2026 Redux-Rev Practice Project</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Documentation</span>
            <span>Github</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
