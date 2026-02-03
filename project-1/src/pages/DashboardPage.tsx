import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';
import { FeatureCard } from '../components/dashboard/FeatureCard';

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