import React, { useState } from 'react';
import RestDemo from './RestDemo';
import GraphQLDemo from './GraphQLDemo';

const APIDashboard = () => {
    const [activeSubTab, setActiveSubTab] = useState('rest');

    const renderContent = () => {
        switch (activeSubTab) {
            case 'rest': return <RestDemo />;
            case 'graphql': return <GraphQLDemo />;
            default: return <RestDemo />;
        }
    };

    const tabs = [
        { id: 'rest', label: '1. REST' },
        { id: 'graphql', label: '2. GraphQL' }
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
        .sub-nav { display: flex; gap: 10px; margin-bottom: 20px; }
        .sub-nav-btn { 
          padding: 8px 16px; border-radius: 20px; border: 1px solid #e2e8f0; 
          background: white; cursor: pointer; font-size: 0.85em; transition: 0.2s;
        }
        .sub-nav-btn:hover { background: #f8fafc; }
        .sub-nav-btn.active { background: #6366f1; color: white; border-color: #6366f1; }
        .sub-content { animation: fadeIn 0.3s ease-out; }
      `}</style>
        </div>
    );
};

export default APIDashboard;
