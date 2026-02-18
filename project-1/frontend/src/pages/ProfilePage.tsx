import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ProfilePage: Allows users to manage their personal information and security settings.
 */
export const ProfilePage = () => {
    const { user, updateProfileName, changePassword } = useAuth();
    const navigate = useNavigate();

    // Profile state
    const [name, setName] = useState(user?.displayName || '');
    const [birthday, setBirthday] = useState('');

    // Password state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Load birthday from localStorage on mount
    useEffect(() => {
        const savedBirthday = localStorage.getItem(`birthday_${user?.uid}`);
        if (savedBirthday) setBirthday(savedBirthday);
    }, [user?.uid]);

    /**
     * handleUpdateProfile: Saves name to Firebase and birthday to localStorage.
     */
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setProfileMsg({ type: '', text: '' });

        try {
            if (name !== user?.displayName) {
                await updateProfileName(name);
            }
            localStorage.setItem(`birthday_${user?.uid}`, birthday);
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * handleChangePassword: Validates and updates the user's password.
     */
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(oldPassword, newPassword);
            setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password. Ensure old password is correct.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pageWrapper">
            <Navbar />
            <div className="container">
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                    ← Back to Dashboard
                </button>

                <h1 className="title">Account Settings</h1>

                <div className="grid">
                    {/* Profile Section */}
                    <div className="card gridItem">
                        <h2 style={{ marginBottom: '1.5rem' }}>Personal Information</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Full Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Email Address</label>
                                <input
                                    type="email"
                                    className="input"
                                    value={user?.email || ''}
                                    disabled
                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Birthday</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                />
                            </div>

                            {profileMsg.text && (
                                <p style={{ color: profileMsg.type === 'success' ? '#27ae60' : '#e74c3c', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    {profileMsg.text}
                                </p>
                            )}

                            <button type="submit" className="btn" style={{ width: '100%' }} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Security Section */}
                    <div className="card gridItem">
                        <h2 style={{ marginBottom: '1.5rem' }}>Security</h2>
                        <form onSubmit={handleChangePassword}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Current Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {passwordMsg.text && (
                                <p style={{ color: passwordMsg.type === 'success' ? '#27ae60' : '#e74c3c', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    {passwordMsg.text}
                                </p>
                            )}

                            <button type="submit" className="btn" style={{ width: '100%', backgroundColor: 'var(--color-accent)' }} disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
