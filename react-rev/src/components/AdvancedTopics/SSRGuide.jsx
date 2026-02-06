import React from 'react';

/**
 * SSRGuide
 * 
 * Chapter 12.5: Server-side rendering (SSR) with React.
 * This is primarily theoretical as it requires a Node.js server setup.
 */
const SSRGuide = () => {
    return (
        <div className="demo-section">
            <h3>12.5. Server-Side Rendering (SSR)</h3>

            <div style={cardStyle}>
                <h4>What is SSR?</h4>
                <p>SSR is the process of rendering components into static HTML on the <strong>server</strong> instead of the browser. This HTML is then sent to the client, leading to faster initial page loads and better SEO.</p>
            </div>

            <div style={gridStyle}>
                <div style={boxStyle}>
                    <h5>Why use it?</h5>
                    <ul>
                        <li>SEO (Search engines can crawl HTML easily).</li>
                        <li>Performance (Faster First Meaningful Paint).</li>
                        <li>Social Sharing (Meta tags work with crawlers).</li>
                    </ul>
                </div>
                <div style={boxStyle}>
                    <h5>How it works:</h5>
                    <ol>
                        <li>Server receives request.</li>
                        <li><code>renderToString()</code> creates HTML.</li>
                        <li>HTML is sent to browser.</li>
                        <li><strong>Hydration:</strong> React "attaches" to existing HTML to make it interactive.</li>
                    </ol>
                </div>
            </div>

            <div style={toolsBox}>
                <h5>Popular SSR Frameworks for React:</h5>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <span style={pill}>Next.js</span>
                    <span style={pill}>Remix</span>
                    <span style={pill}>Gatsby (Static Site Gen)</span>
                </div>
            </div>
        </div>
    );
};

const cardStyle = { padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '15px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const boxStyle = { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9em' };
const toolsBox = { marginTop: '20px', padding: '15px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' };
const pill = { padding: '4px 12px', background: '#3b82f6', color: 'white', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold' };

export default SSRGuide;
