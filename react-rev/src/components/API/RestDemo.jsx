import React, { useState, useEffect } from 'react';

/**
 * RestDemo Component
 * 
 * Concept: Integrating with REST APIs using the native Fetch API.
 * Demonstrates: Loading states, error handling, and data mapping.
 */
const RestDemo = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch data from a REST endpoint
    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            // JSONPlaceholder is a free fake REST API for testing
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPosts(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="api-demo-box">
            <h4>1. REST API with Fetch</h4>
            <p style={{ fontSize: '0.85em' }}>Fetching data from a JSONPlaceholder endpoint.</p>

            <button onClick={fetchPosts} disabled={loading} style={refreshBtn}>
                {loading ? 'Fetching...' : 'Refresh Posts'}
            </button>

            {error && <div style={errorCard}>Error: {error}</div>}

            {loading ? (
                <div style={spinnerStyle}>Loading posts...</div>
            ) : (
                <ul style={listStyle}>
                    {posts.map(post => (
                        <li key={post.id} style={itemStyle}>
                            <strong>{post.title}</strong>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>{post.body.substring(0, 50)}...</p>
                        </li>
                    ))}
                </ul>
            )}

            <div style={noteStyle}>
                <strong>Implementation Detail:</strong> Data fetching is handled inside a <code>useEffect</code> hook to ensure it runs when the component mounts. Loading and error states are tracked independently to provide a better user experience.
            </div>
        </div>
    );
};

// --- Styles ---
const refreshBtn = {
    padding: '6px 12px',
    background: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '15px'
};

const listStyle = { listStyle: 'none', padding: 0, margin: 0 };

const itemStyle = {
    padding: '10px',
    borderBottom: '1px solid #e1e8ed',
    marginBottom: '5px'
};

const errorCard = {
    padding: '10px',
    background: '#fed7d7',
    color: '#c53030',
    borderRadius: '4px',
    marginBottom: '10px'
};

const spinnerStyle = { padding: '20px', textAlign: 'center', color: '#666' };

const noteStyle = {
    marginTop: '20px',
    padding: '10px',
    background: '#ebf8ff',
    border: '1px solid #bee3f8',
    borderRadius: '4px',
    fontSize: '0.8em'
};

export default RestDemo;
