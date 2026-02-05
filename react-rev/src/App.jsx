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
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Concepts Revision</h1>
        <p className="subtitle">Chapters 1-6: Components, Props, State, and Events</p>
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
          2-4. Props & State
        </button>
        <button
          className={activeTab === 'events' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('events')}
        >
          6. Event Handling
        </button>
      </nav>

      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>Created for Talview Internship Revision</p>
      </footer>
    </div>
  );
}

export default App;
