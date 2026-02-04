import styles from './FeatureCard.module.css';

interface FeatureCardProps {
    title: string;
    description: string;
    onClick: () => void;
}

/**
 * FeatureCard: A reusable UI component used on the Dashboard to represent application features.
 */
export const FeatureCard = ({ title, description, onClick }: FeatureCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`${styles.navCard} card`}
            style={{ cursor: 'pointer' }}
        >
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};
