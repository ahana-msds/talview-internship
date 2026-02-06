import React, { useState } from 'react';
import PerformanceClass from './PerformanceClass';
import HOCDemo from './HOCDemo';
import RenderPropsDemo from './RenderPropsDemo';
import SSRGuide from './SSRGuide';
import Accessibility from './Accessibility';

const AdvancedDashboard = () => {
    const [activeSubTab, setActiveSubTab] = useState('performance');

    const renderContent = () => {
        switch (activeSubTab) {
            case 'performance': return <PerformanceClass />;
            case 'hoc': return <HOCDemo />;
            case 'renderProps': return <RenderPropsDemo />;
            case 'ssr': return <SSRGuide />;
            case 'a11y': return <Accessibility />;
            default: return <PerformanceClass />;
        }
    };

    const tabs = [
        { id: 'performance', label: '1. Class Performance' },
        { id: 'hoc', label: '2. HOC' },
        { id: 'renderProps', label: '3. Render Props' },
        { id: 'ssr', label: '4. SSR Theory' },
        { id: 'a11y', label: '5. Accessibility' }
    ];

    return (
        <div className="section-dashboard">
            <div className="sub-nav">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={activeSubTab === tab.id ? 'sub-nav-btn active' : 'sub-nav-btn'}
                        onClick={() => setActiveSubTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="sub-content">
                {renderContent()}
            </div>

            <style>{`
        .sub-nav { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .sub-nav-btn { 
          padding: 8px 16px; border-radius: 20px; border: 1px solid #e2e8f0; 
          background: white; cursor: pointer; font-size: 0.85em; transition: 0.2s;
        }
        .sub-nav-btn:hover { background: #f8fafc; }
        .sub-nav-btn.active { background: #f97316; color: white; border-color: #f97316; }
        .sub-content { animation: fadeIn 0.3s ease-out; }
      `}</style>
        </div>
    );
};

export default AdvancedDashboard;
