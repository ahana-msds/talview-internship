import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import A11yComponent from './components/A11yComponent.jsx';
import { selectUserTheme, selectUserActivityCount } from './store/userSlice.js';

function App() {
    const dispatch = useDispatch();
    const theme = useSelector(selectUserTheme);
    const activityCount = useSelector(selectUserActivityCount);
    const loading = useSelector(state => state.user.loading);
    const activity = useSelector(state => state.user.activity);

    const handleScrollDemo = () => {
        // Dispatch an action that the Saga is throttled on
        dispatch({ type: 'USER_SCROLLED' });
    };

    return (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Advanced Patterns: SSR, A11y, Saga</h1>

            <div style={{ background: '#eee', padding: '10px', borderRadius: '4px' }}>
                <p><strong>Theme:</strong> {theme}</p>
                <p><strong>Activities Recorded:</strong> {activityCount}</p>
                <p><strong>Status:</strong> {loading ? 'Processing...' : 'Ready'}</p>
            </div>

            <A11yComponent />

            <section aria-labelledby="saga-title">
                <h2 id="saga-title">Redux Saga Throttle Demo</h2>
                <p>Clicking the button below rapidly will only trigger the logger every 2 seconds.</p>
                <button
                    onClick={handleScrollDemo}
                    disabled={loading}
                    style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}
                >
                    Simulate High-Frequency Event (Scroll)
                </button>

                <ul style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px' }}>
                    {activity.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

export default App;
