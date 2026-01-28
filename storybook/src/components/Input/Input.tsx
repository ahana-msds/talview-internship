import React from 'react';
import './Input.css';

// interface for input component props
interface InputProps {
    /** the label associated with the input */
    label: string;
    /** placeholder text inside the input */
    placeholder?: string;
    /** the type of input (text, password, email) */
    type?: 'text' | 'password' | 'email';
    /** an error message to display */
    error?: string;
    /** whether the input is disabled */
    disabled?: boolean;
    /** change event handler */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * atomic input component with label and error support
 * styling is handled via external css
 */
export const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    type = 'text',
    error,
    disabled = false,
    onChange,
}) => {
    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <input
                type={type}
                className={['input', error ? 'input--error' : ''].join(' ')}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};
