import React from 'react';
import './Card.css';

// interface for card component props
interface CardProps {
    /** the main title of the card */
    title: string;
    /** the descriptive content text */
    content: string;
    /** optional element to render in the footer area */
    footer?: React.ReactNode;
}

/**
 * atomic card component for grouping related content
 * demonstrates composition by allowing custom footers
 */
export const Card: React.FC<CardProps> = ({ title, content, footer }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
            </div>
            <div className="card-body">
                <p className="card-text">{content}</p>
            </div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};
