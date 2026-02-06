import React, { useState, useEffect } from 'react';

/**
 * HOCDemo
 * 
 * Chapter 12.3: Higher-Order Components (HOC).
 * An HOC is a function that takes a component and returns a new component.
 */

// 1. Defining the HOC: withLoading
// It wraps a component and shows a loading message until data is ready.
const withLoading = (WrappedComponent) => {
    return ({ isLoading, ...props }) => {
        if (isLoading) {
            return (
                <div style={loadingStyle}>
                    <div className="spinner"></div>
                    <p>HOC: Loading data, please wait...</p>
                </div>
            );
        }
        return <WrappedComponent {...props} />;
    };
};

// 2. A simple component to be wrapped
const DataDisplay = ({ data }) => (
    <div style={displayStyle}>
        <h4>Data Loaded Successfully!</h4>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
);

// 3. Enhancing the component with the HOC
const DataDisplayWithLoading = withLoading(DataDisplay);

const HOCDemo = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setData({ user: "Intern", status: "Active", project: "React Rev" });
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="demo-section">
            <h3>12.3. Higher-Order Components (HOC)</h3>
            <p style={{ fontSize: '0.85em', color: '#666' }}>
                HOCs are a pattern for reusing component logic. They are not part of the React API, but a pattern that emerges from React's compositional nature.
            </p>

            {/* Using the enhanced component */}
            <DataDisplayWithLoading isLoading={loading} data={data} />

            <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }} style={btnStyle}>
                Simulate Re-fetch
            </button>

            <div style={noteStyle}>
                <strong>Implementation:</strong> The <code>withLoading</code> function intercepts the render. If <code>isLoading</code> is true, it renders the loader; otherwise, it passes all props through to the original component.
            </div>

            <style>{`
        .spinner {
          width: 30px; height: 30px; border: 4px solid #f3f3f3; 
          border-top: 4px solid #3498db; border-radius: 50%; 
          animation: spin 1s linear infinite; margin-bottom: 10px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

const loadingStyle = { padding: '20px', textAlign: 'center', background: '#f1f5f9', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const displayStyle = { padding: '20px', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px' };
const btnStyle = { marginTop: '15px', padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' };
const noteStyle = { marginTop: '20px', padding: '10px', background: '#f8fafc', fontSize: '0.8em', borderLeft: '4px solid #3b82f6' };

export default HOCDemo;
