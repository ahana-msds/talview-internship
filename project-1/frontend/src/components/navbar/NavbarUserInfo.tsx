import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Navbar.module.css';

interface NavbarUserInfoProps {
    displayName?: string | null;
}

/**
 * NavbarUserInfo: Displays the currently logged-in user's name as a dropdown.
 * Provides links to Profile Settings and Address Management.
 */
export const NavbarUserInfo = ({ displayName }: NavbarUserInfoProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <span
                className={styles.userInfo}
                onClick={() => setIsOpen(!isOpen)}
            >
                Hi, {displayName || 'Guest'} ▾
            </span>

            {isOpen && (
                <div className={styles.dropdownContent}>
                    <div
                        className={styles.dropdownItem}
                        onClick={() => handleNavigate('/profile')}
                    >
                        👤 Profile Settings
                    </div>
                    <div
                        className={styles.dropdownItem}
                        onClick={() => handleNavigate('/addresses')}
                    >
                        📍 Addresses
                    </div>
                </div>
            )}
        </div>
    );
};
