import { Navbar } from '../components/Navbar';
import { GithubFetcher } from '../features/GithubFetcher';
import { Link } from 'react-router-dom';
export const GitHubPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 20px', flex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
                </div>
                <h2>GitHub Explorer</h2>
                <div style={{ marginTop: '1rem', maxWidth: '800px', margin: '1rem auto' }}>
                    <GithubFetcher />
                </div>
            </div>
        </div>
    );
};
