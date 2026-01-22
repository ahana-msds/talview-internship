import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
export const DashboardPage = () => {
    const { user } = useAuth();
    const showGithub = user?.provider === 'github';
    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={`container ${styles.container}`}>

                <p style={{ marginBottom: '2rem', marginTop: '-1.5rem', opacity: 0.7 }}>Select a feature to get started.</p>
                <div className={styles.grid}>
                    {/* Feature 1: Todo List */}
                    <Link to="/todo" className={`${styles.navCard} card`}>
                        <h3>Task Manager</h3>
                        <p>Manage your daily tasks efficiently.</p>
                    </Link>
                    {/* Feature 2: Product API */}
                    <Link to="/products" className={`${styles.navCard} card`}>
                        <h3> Product Catalog</h3>
                        <p>Browse products from the store API.</p>
                    </Link>
                    {/* Feature 3: Github API (Conditional) */}
                    {showGithub && (
                        <Link to="/github" className={`${styles.navCard} card`}>
                            <h3> GitHub Explorer</h3>
                            <p>View your profile and repositories.</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
