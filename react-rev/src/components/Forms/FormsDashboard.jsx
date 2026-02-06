import React, { useState } from 'react';
import ControlledVsUncontrolled from './ControlledVsUncontrolled';
import FormHandling from './FormHandling';
import FormValidation from './FormValidation';

const FormsDashboard = () => {
    const [activeSubTab, setActiveSubTab] = useState('controlled');

    const renderContent = () => {
        switch (activeSubTab) {
            case 'controlled': return <ControlledVsUncontrolled />;
            case 'handling': return <FormHandling />;
            case 'validation': return <FormValidation />;
            default: return <ControlledVsUncontrolled />;
        }
    };

    const tabs = [
        { id: 'controlled', label: '7.1. Controlled vs Uncontrolled' },
        { id: 'handling', label: '7.2-7.3. Handling & Submission' },
        { id: 'validation', label: '7.4. Validation' }
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
        .sub-nav-btn.active { background: #10b981; color: white; border-color: #10b981; }
        .sub-content { animation: fadeIn 0.3s ease-out; }
      `}</style>
        </div>
    );
};

export default FormsDashboard;
