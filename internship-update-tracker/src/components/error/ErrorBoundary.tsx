import React from "react";

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h2>ui crashed</h2>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
