import React, { Component } from 'react';

/**
 * Class-Based Component
 * 
 * This is the traditional way of writing React components.
 * It must extend React.Component and implement a render() method.
 */
class ClassComponent extends Component {
    // Class components manage state and lifecycle methods differently than functional ones.
    render() {
        return (
            <div style={{ border: '2px solid #f97316', padding: '20px', borderRadius: '8px', margin: '10px' }}>
                <h2>Class Component</h2>
                <p>I am a Class Component! I extend React.Component.</p>
                <ul>
                    <li>Requires a <code>render()</code> method to return JSX.</li>
                    <li>Uses <code>this.state</code> and <code>this.setState</code>.</li>
                    <li>Lifecycle methods like <code>componentDidMount</code> are used here.</li>
                </ul>
            </div>
        );
    }
}

export default ClassComponent;
