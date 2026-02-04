import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';
import { FeatureCard } from '../components/dashboard/FeatureCard';

/**
 * DashboardPage is the main landing page for authenticated users.
 * It provides navigation cards for the application's core features.
 */
export const DashboardPage = () => {
    const { user } = useAuth();
    // Only show GitHub Explorer if the user logged in via GitHub
    const showGithub = user?.provider === 'github';

    /**
     * Opens a specific application route in a new browser tab.
     */
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
                    <FeatureCard
                        title="Task Manager"
                        description="Manage your daily tasks efficiently."
                        onClick={() => openInNewTab('/todo')}
                    />

                    <FeatureCard
                        title="Product Catalog"
                        description="Browse products from the store API."
                        onClick={() => openInNewTab('/products')}
                    />

                    {showGithub && (
                        <FeatureCard
                            title="GitHub Explorer"
                            description="View your profile and repositories."
                            onClick={() => openInNewTab('/github')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};