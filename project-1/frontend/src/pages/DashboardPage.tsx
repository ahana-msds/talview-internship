import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';
import { FeatureCard } from '../components/dashboard/FeatureCard';
import * as Sentry from "@sentry/react";

/**
 * DashboardPage: Professional landing page with feature cards and development tools.
 */
export const DashboardPage = () => {
    const { user } = useAuth();
    const showGithub = user?.provider === 'github';

    const openInNewTab = (path: string) => {
        window.open(path, '_blank');
    };

    /**
     * triggerSentryTest: Manually throws an error to verify Sentry reporting.
     */
    const triggerSentryTest = () => {
        console.log("Triggering Sentry test error...");
        Sentry.captureException(new Error("Sentry Manual Verification Error - Dashboard"));
    };

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.displayName || 'Developer'}</h1>
                        <p style={{ opacity: 0.6 }}>Select a module to continue your work.</p>
                    </div>
                    {/* Sentry Verification Tool */}
                    <button
                        onClick={triggerSentryTest}
                        className="btn btn-secondary"
                        style={{ border: '1px dashed var(--color-border)', textTransform: 'none' }}
                        title="Click to verify your Sentry integration by sending a test error."
                    >
                        🛠️ Verify Sentry
                    </button>
                </div>

                <div className={styles.grid}>
                    <FeatureCard
                        emoji="📝"
                        title="Task Manager"
                        description="Keep track of your project tasks and deadlines with persistent local storage."
                        onClick={() => openInNewTab('/todo')}
                    />

                    <FeatureCard
                        emoji="🛍️"
                        title="Product Catalog"
                        description="Explore and manage shop products synchronized with external APIs."
                        onClick={() => openInNewTab('/products')}
                    />

                    {showGithub && (
                        <FeatureCard
                            emoji="🐙"
                            title="GitHub Explorer"
                            description="Browse repositories and professional profiling directly from GitHub."
                            onClick={() => openInNewTab('/github')}
                        />
                    )}

                    {user?.email === 'admin@talview.com' && (
                        <FeatureCard
                            emoji="🔐"
                            title="Admin Dashboard"
                            description="Monitor live orders, manage requests, and control Temporal workflows."
                            onClick={() => openInNewTab('/admin')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};