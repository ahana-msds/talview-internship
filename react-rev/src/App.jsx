import React, { useState } from 'react';
import './App.css';

// Importing all demonstration components
import FunctionalComponent from './components/BasicComponents/FunctionalComponent';
import ClassComponent from './components/BasicComponents/ClassComponent';
import PropsDemo from './components/StateAndProps/PropsDemo';
import StateDemo from './components/StateAndProps/StateDemo';
import SyntheticEvents from './components/EventHandling/SyntheticEvents';
import EventBubbling from './components/EventHandling/EventBubbling';
import PreventDefaultDemo from './components/EventHandling/PreventDefaultDemo';
import HooksDashboard from './components/HooksDemo/HooksDashboard';
import FormsDashboard from './components/Forms/FormsDashboard';
import RoutingDashboard from './components/Routing/RoutingDashboard';
import DebuggingDemo from './components/Debugging/DebuggingDemo';
import APIDashboard from './components/API/APIDashboard';
import TestingDemo from './components/Testing/TestingDemo';
import AdvancedDashboard from './components/AdvancedTopics/AdvancedDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('components');

  const renderContent = () => {
    switch (activeTab) {
      case 'components':
        return (
          <div className="section-fade-in">
            <FunctionalComponent />
            <ClassComponent />
          </div>
        );
      case 'props-state':
        return (
          <div className="section-fade-in">
            <PropsDemo />
            <StateDemo />
          </div>
        );
      case 'events':
        return (
          <div className="section-fade-in">
            <SyntheticEvents />
            <EventBubbling />
            <PreventDefaultDemo />
          </div>
        );
      case 'hooks':
        return (
          <div className="section-fade-in">
            <HooksDashboard />
          </div>
        );
      case 'forms':
        return (
          <div className="section-fade-in">
            <FormsDashboard />
          </div>
        );
      case 'routing':
        return (
          <div className="section-fade-in">
            <RoutingDashboard />
          </div>
        );
      case 'debugging':
        return (
          <div className="section-fade-in">
            <DebuggingDemo />
          </div>
        );
      case 'api':
        return (
          <div className="section-fade-in">
            <APIDashboard />
          </div>
        );
      case 'testing':
        return (
          <div className="section-fade-in">
            <TestingDemo />
          </div>
        );
      case 'advanced':
        return (
          <div className="section-fade-in">
            <AdvancedDashboard />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Concepts Revision</h1>
        <p className="subtitle">From Basics to Advanced API Integration</p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'components' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('components')}
        >
          1. Basic Components
        </button>
        <button
          className={activeTab === 'props-state' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('props-state')}
        >
          2. Props & State
        </button>
        <button
          className={activeTab === 'events' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('events')}
        >
          3. Event Handling
        </button>
        <button
          className={activeTab === 'hooks' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('hooks')}
        >
          4. React Hooks
        </button>
        <button
          className={activeTab === 'forms' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('forms')}
        >
          5. Forms
        </button>
        <button
          className={activeTab === 'routing' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('routing')}
        >
          6. Routing
        </button>
        <button
          className={activeTab === 'debugging' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('debugging')}
        >
          7. Debugging & Error Boundaries
        </button>
        <button
          className={activeTab === 'api' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('api')}
        >
          8. API Integration
        </button>
        <button
          className={activeTab === 'testing' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('testing')}
        >
          9. Unit Testing
        </button>
        <button
          className={activeTab === 'advanced' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('advanced')}
        >
          11. Advanced Topics
        </button>
      </nav>

      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>Created for Revision</p>
      </footer>
    </div>
  );
}

export default App;
