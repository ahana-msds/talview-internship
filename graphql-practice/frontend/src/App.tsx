import { useState } from 'react';
import { ProjectList } from './components/ProjectList';
import { TaskList } from './components/TaskList';
import './App.css';

function App() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>GraphQL Practice Dashboard</h1>
                {selectedProjectId && (
                    <button className="back-btn" onClick={() => setSelectedProjectId(null)}>
                        ← Back to Projects
                    </button>
                )}
            </header>

            <main className="app-main">
                {!selectedProjectId ? (
                    <div className="view-container">
                        <h2>Active Projects</h2>
                        <ProjectList onSelectProject={setSelectedProjectId} />
                    </div>
                ) : (
                    <div className="view-container">
                        <TaskList projectId={selectedProjectId} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
