import { Navbar } from '../components/Navbar';
import { GithubFetcher } from '../features/GithubFetcher';
import { useNavigate } from 'react-router-dom';

export const GitHubPage = () => {
    const navigate = useNavigate();

    const goToDashboard = () => {
        // Check if opened in new tab
        if (window.opener) {
            window.close();
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ padding: '1rem 20px', textAlign: 'left' }}>
                <button
                    onClick={goToDashboard}
                    className="btn btn-secondary"
                >
                    ← Back to Dashboard
                </button>
            </div>
            <div className="container" style={{ padding: '1rem 20px', flex: 1, textAlign: 'left' }}>
                <h2>GitHub Explorer</h2>
                <div style={{ marginTop: '1rem', maxWidth: '800px', margin: '1rem auto' }}>
                    <GithubFetcher />
                </div>
            </div>
        </div>
    );
};