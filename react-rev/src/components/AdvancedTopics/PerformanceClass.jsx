import React, { Component, PureComponent } from 'react';

/**
 * PerformanceClass Demo
 * 
 * Chapter 12.1: Optimizing performance with shouldComponentUpdate and PureComponent.
 */

// 1. A Regular Component that renders every time the parent renders
class RegularChild extends Component {
    render() {
        console.log("RegularChild: Rendering...");
        return <div style={childStyle}>Regular Child (Always Renders)</div>;
    }
}

// 2. A PureComponent that performs a shallow comparison of props and state
class PureChild extends PureComponent {
    render() {
        console.log("PureChild: Rendering...");
        return <div style={childStyle}>Pure Child (Optimized via Shallow Comparison)</div>;
    }
}

// 3. Manual optimization using shouldComponentUpdate
class OptimizedChild extends Component {
    shouldComponentUpdate(nextProps) {
        // Only re-render if the 'name' prop changes
        return nextProps.name !== this.props.name;
    }

    render() {
        console.log("OptimizedChild: Rendering...");
        return <div style={childStyle}>Optimized Child (Manual shouldComponentUpdate)</div>;
    }
}

class PerformanceClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            name: "React"
        };
    }

    render() {
        return (
            <div className="demo-section">
                <h3>12.1. Class Performance Optimization</h3>
                <p>Check the console to see which components re-render when you increment the count.</p>

                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => this.setState({ count: this.state.count + 1 })} style={btnStyle}>
                        Increment Count: {this.state.count}
                    </button>
                    <button onClick={() => this.setState({ name: "React " + Math.random().toString(36).substring(7) })} style={btnStyle}>
                        Change Name
                    </button>
                </div>

                <RegularChild />
                <PureChild name={this.state.name} />
                <OptimizedChild name={this.state.name} />

                <div style={noteStyle}>
                    <strong>Note:</strong> <code>PureComponent</code> is the class-based equivalent of <code>React.memo</code>. It prevents re-renders if props are shallowly equal.
                </div>
            </div>
        );
    }
}

const childStyle = { padding: '10px', border: '1px solid #ddd', margin: '5px 0', borderRadius: '4px', background: '#f8fafc' };
const btnStyle = { padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' };
const noteStyle = { marginTop: '20px', padding: '10px', background: '#fffbeb', border: '1px solid #fef3c7', fontSize: '0.85em' };

export default PerformanceClass;
