import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { TodoList } from '../features/TodoList';
import { ProductFetcher } from '../features/ProductFetcher';
import { GithubFetcher } from '../features/GithubFetcher';
import styles from './DashboardPage.module.css';
export const DashboardPage = () => {
    const { user } = useAuth();
    const showGithub = user?.provider === 'github';
    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <h2 className={styles.title}>Dashboard</h2>

                <div className={styles.grid}>
                    {/* Feature 1: Todo List */}
                    <div className={styles.gridItem}>
                        <TodoList />
                    </div>
                    {/* Feature 2: Product API */}
                    <div className={styles.gridItem}>
                        <ProductFetcher />
                    </div>
                    {/* Feature 3: Github API (Conditional) */}
                    {showGithub && (
                        <div className={styles.gridItem}>
                            <GithubFetcher />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
