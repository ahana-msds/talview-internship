import styles from './FeatureCard.module.css';

interface FeatureCardProps {
    title: string;
    description: string;
    emoji?: string;
    onClick: () => void;
}

/**
 * FeatureCard: A reusable UI component used on the Dashboard to represent application features.
 */
export const FeatureCard = ({ title, description, emoji, onClick }: FeatureCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`${styles.navCard} card`}
            style={{ cursor: 'pointer', textAlign: 'left' }}
        >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{emoji}</div>
            <h3>{title}</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>{description}</p>
        </div>
    );
};
