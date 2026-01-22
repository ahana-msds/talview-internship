import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const { user } = useAuth();
    const showGithub = user?.provider === 'github';

    const openInNewTab = (path: string) => {
        window.open(path, '_blank');
    };

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <p style={{ marginBottom: '2rem', marginTop: '-1.5rem', opacity: 0.7 }}>
                    Select a feature to get started.
                </p>
                <div className={styles.grid}>
                    {/* Feature 1: Todo List */}
                    <div
                        onClick={() => openInNewTab('/todo')}
                        className={`${styles.navCard} card`}
                        style={{ cursor: 'pointer' }}
                    >
                        <h3> Task Manager</h3>
                        <p>Manage your daily tasks efficiently.</p>
                    </div>

                    {/* Feature 2: Product API */}
                    <div
                        onClick={() => openInNewTab('/products')}
                        className={`${styles.navCard} card`}
                        style={{ cursor: 'pointer' }}
                    >
                        <h3> Product Catalog</h3>
                        <p>Browse products from the store API.</p>
                    </div>

                    {/* Feature 3: Github API (Conditional) */}
                    {showGithub && (
                        <div
                            onClick={() => openInNewTab('/github')}
                            className={`${styles.navCard} card`}
                            style={{ cursor: 'pointer' }}
                        >
                            <h3> GitHub Explorer</h3>
                            <p>View your profile and repositories.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};