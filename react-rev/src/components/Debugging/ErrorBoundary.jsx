import React, { Component } from 'react';

/**
 * ErrorBoundary Component
 * 
 * Chapter: Error Boundaries.
 * React Error Boundaries must be class-based components.
 * They catch JavaScript errors anywhere in their child component tree, 
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // This lifecycle method is called when an error is thrown in a descendant component
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    // Used to log error information
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={fallbackStyle}>
                    <h4>Something went wrong.</h4>
                    <p style={{ fontSize: '0.85em' }}>
                        The Error Boundary caught a crash in its children.
                        Check the console for details.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={retryBtnStyle}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const fallbackStyle = {
    padding: '20px',
    background: '#fef2f2',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    color: '#991b1b',
    textAlign: 'center',
    margin: '10px 0'
};

const retryBtnStyle = {
    padding: '8px 16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
};

export default ErrorBoundary;
