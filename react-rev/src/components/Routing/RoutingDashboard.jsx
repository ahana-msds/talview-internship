import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutingBasics from './RoutingBasics';
import DynamicRouting from './DynamicRouting';
import ProtectedRouteDemo from './ProtectedRouteDemo';

const RoutingDashboard = () => {
    const [activeSubTab, setActiveSubTab] = useState('basics');

    const renderContent = () => {
        switch (activeSubTab) {
            case 'basics': return <RoutingBasics />;
            case 'dynamic': return <DynamicRouting />;
            case 'protected': return <ProtectedRouteDemo />;
            default: return <RoutingBasics />;
        }
    };

    const tabs = [
        { id: 'basics', label: '8.1-8.2. Basics' },
        { id: 'dynamic', label: '8.3. Dynamic Params' },
        { id: 'protected', label: '8.4. Protected Routes' }
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

            {/* 
        IMPORTANT: We wrap the content in BrowserRouter only for the Routing Demos 
        to isolate it from the main app's non-routing structure.
      */}
            <BrowserRouter>
                <div className="sub-content">
                    {renderContent()}
                </div>
            </BrowserRouter>

            <style>{`
        .sub-nav { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
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

export default RoutingDashboard;
