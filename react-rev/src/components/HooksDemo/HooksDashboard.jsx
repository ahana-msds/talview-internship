import React, { useState } from 'react';
import UseState from './UseState';
import UseEffect from './UseEffect';
import UseContext from './UseContext';
import UseRef from './UseRef';
import UseMemo from './UseMemo';
import UseCallback from './UseCallback';
import ReactMemo from './ReactMemo';
import useCounter from './useCounter';

/**
 * HooksDashboard Component
 * 
 * Acts as a sub-navigation hub for exploring individual Hook demonstrations.
 */
const HooksDashboard = () => {
    const [activeHook, setActiveHook] = useState('useState');

    // Custom Hook instance for the dashboard header
    const { count, increment, reset } = useCounter(10);

    const renderHookDemo = () => {
        switch (activeHook) {
            case 'useState': return <UseState />;
            case 'useEffect': return <UseEffect />;
            case 'useContext': return <UseContext />;
            case 'useRef': return <UseRef />;
            case 'useMemo': return <UseMemo />;
            case 'useCallback': return <UseCallback />;
            case 'React.memo': return <ReactMemo />;
            default: return <UseState />;
        }
    };

    const hooks = [
        'useState', 'useEffect', 'useContext',
        'useRef', 'useMemo', 'useCallback', 'React.memo'
    ];

    return (
        <div className="hooks-dashboard">
            <div className="custom-hook-banner">
                <h4>Custom Hook: useCounter</h4>
                <p>Count: <strong>{count}</strong></p>
                <button onClick={increment}>Increment</button>
                <button onClick={reset}>Reset</button>
            </div>

            <div className="hooks-nav-tabs">
                {hooks.map(hook => (
                    <button
                        key={hook}
                        className={activeHook === hook ? 'hook-tab active' : 'hook-tab'}
                        onClick={() => setActiveHook(hook)}
                    >
                        {hook}
                    </button>
                ))}
            </div>

            <div className="hook-content-area">
                {renderHookDemo()}
            </div>

            <style>{`
        .hooks-dashboard {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .custom-hook-banner {
          background: #eff6ff;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid #bfdbfe;
        }
        .hooks-nav-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
        }
        .hook-tab {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .hook-tab:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .hook-tab.active {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }
        .hook-demo-box {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hook-demo-box h3 {
          margin-top: 0;
          color: #1e293b;
        }
        button {
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
        }
        button:hover {
          background: #f1f5f9;
        }
      `}</style>
        </div>
    );
};

export default HooksDashboard;
