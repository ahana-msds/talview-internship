import React from 'react';

/**
 * Accessibility (A11y)
 * 
 * Chapter 12.6: Accessibility in React.
 */
const Accessibility = () => {
    return (
        <div className="demo-section">
            <h3>12.6. Accessibility (A11y)</h3>
            <p>Building inclusive web applications means ensuring everyone, including people using screen readers, can use your app.</p>

            <div style={checklistStyle}>
                <h4>Best Practices for React Developers:</h4>
                <div style={itemStyle}>
                    <strong>1. Semantic HTML:</strong> Always use <code>&lt;button&gt;</code> for buttons and <code>&lt;a&gt;</code> for links. Avoid "Div-itis".
                </div>
                <div style={itemStyle}>
                    <strong>2. Alt Text:</strong> Provide descriptive <code>alt</code> attributes for images.
                    <img
                        src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=100&fit=crop"
                        alt="React Logo on a dark blue background"
                        style={{ display: 'block', marginTop: '8px', borderRadius: '4px' }}
                    />
                </div>
                <div style={itemStyle}>
                    <strong>3. ARIA Attributes:</strong> Use <code>aria-label</code> when the purpose is not clear from text.
                    <button aria-label="Close this section" style={closeBtnStyle}>X</button>
                </div>
                <div style={itemStyle}>
                    <strong>4. Fragments vs Divs:</strong> Use <code>&lt;React.Fragment&gt;</code> or <code>&lt;&gt;</code> to avoid breaking the semantic DOM structure (e.g., inside tables).
                </div>
            </div>

            <div style={toolsStyle}>
                <h4>Testing Tools:</h4>
                <ul>
                    <li><strong>eslint-plugin-jsx-a11y:</strong> Static analysis for errors.</li>
                    <li><strong>axe-core / react-axe:</strong> Real-time feedback in console.</li>
                    <li><strong>Screen Readers:</strong> VoiceOver (Mac), NVDA (Windows).</li>
                </ul>
            </div>
        </div>
    );
};

const checklistStyle = { padding: '15px', background: '#f0fdf4', border: '1px solid #16a34a', borderRadius: '8px' };
const itemStyle = { marginBottom: '15px', fontSize: '0.9em', borderLeft: '3px solid #16a34a', paddingLeft: '10px' };
const toolsStyle = { marginTop: '20px', padding: '15px', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '8px' };
const closeBtnStyle = { marginLeft: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px' };

export default Accessibility;
