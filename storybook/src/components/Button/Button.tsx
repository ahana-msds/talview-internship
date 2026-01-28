import React from 'react';
import './Button.css';

// define the props for the button component
interface ButtonProps {
    /** the text to display on the button */
    label: string;
    /** the visual style variant */
    variant?: 'primary' | 'secondary' | 'danger';
    /** the size of the button */
    size?: 'small' | 'medium' | 'large';
    /** optional click handler */
    onClick?: () => void;
    /** whether the button is disabled */
    disabled?: boolean;
}

/**
 * reusable button component with various styles and sizes
 * demonstrates atom-level component design in storybook
 */
export const Button: React.FC<ButtonProps> = ({
    label,
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
}) => {
    // combine classes based on props
    const classes = [
        'button',
        `button--${variant}`,
        `button--${size}`,
    ].join(' ');

    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};
