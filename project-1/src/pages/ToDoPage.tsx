import { Navbar } from '../components/Navbar';
import { TodoList } from '../features/TodoList';
import { useNavigate } from 'react-router-dom';

/**
 * ToDoPage component serves as the container for the Task Manager feature.
 * It provides a "Back to Dashboard" button and renders the TodoList component.
 */
export const ToDoPage = () => {
    const navigate = useNavigate();

    /**
     * Navigates back to the Dashboard.
     * If the page was opened in a new tab, it closes the tab; otherwise, it redirects to /dashboard.
     */
    const goToDashboard = () => {
        // Check if opened in new tab
        if (window.opener) {
            window.close();
        } else {
            navigate('/dashboard');
        }
    };

    const triggerManualCrash = () => {
        throw new Error('Manual crash triggered by user.');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ padding: '1rem 20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <button onClick={goToDashboard} className="btn btn-secondary">
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
            <div className="container" style={{ padding: '1rem 20px', flex: 1, textAlign: 'left' }}>
                <h2>Task Manager</h2>
                <div style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
                    <TodoList />
                </div>
            </div>
        </div>
    );
};