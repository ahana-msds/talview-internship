
import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProductList from './components/ProductList/ProductList';
import MouseTracker from './components/RenderProps/MouseTracker';
import AccessibleForm from './components/Forms/AccessibleForm';

// separate component to consume theme and apply styles
const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();

  const styles = {
    backgroundColor: theme === 'light' ? '#fff' : '#333',
    color: theme === 'light' ? '#000' : '#fff',
    minHeight: '100vh',
    padding: '20px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={styles}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>Chapter 13: Advanced React Patterns</h1>
        <button onClick={toggleTheme}>
          switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>Optimization & HOC</h2>
          <ProductList />
        </section>

        <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>Render Props</h2>
          {/* using the render prop to render a spotlight effect */}
          <MouseTracker render={({ x, y }) => (
            <div style={{ pointerEvents: 'none' }}>
              <p>mouse position: ({x}, {y})</p>
              <div style={{
                position: 'absolute',
                left: x - 10,
                top: y - 10,
                width: '20px',
                height: '20px',
                background: 'rgba(255, 0, 0, 0.5)',
                borderRadius: '50%'
              }} />
            </div>
          )} />
        </section>

        <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>Accessibility & Refs</h2>
          <AccessibleForm />
        </section>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
};

export default App;
