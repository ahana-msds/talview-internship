import React, { useState } from 'react';
import styles from './GithubFetcher.module.css';
interface GithubUser {
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
}
export const GithubFetcher = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState<GithubUser | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        setLoading(true);
        setError('');
        setUserData(null);
        try {
            const res = await fetch(`https://api.github.com/users/${username}`);
            if (!res.ok) throw new Error('User not found');
            const data = await res.json();
            setUserData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={`card ${styles.featureCard}`}>
            <h3 className={styles.header}>
                GitHub API Explorer
            </h3>

            <form onSubmit={handleSearch} className={styles.form}>
                <input
                    className="input"
                    placeholder="GitHub Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit" className="btn" disabled={loading}>Search</button>
            </form>
            {error && <div className={styles.error}>{error}</div>}
            {userData && (
                <div className={styles.profile}>
                    <img
                        src={userData.avatar_url}
                        alt={userData.login}
                        className={styles.avatar}
                    />
                    <h4 className={styles.name}>{userData.name || userData.login}</h4>
                    <p className={styles.bio}>{userData.bio}</p>
                    <div className={styles.stats}>
                        <div>
                            <strong>{userData.public_repos}</strong>
                            <div className={styles.statLabel}>Repos</div>
                        </div>
                        <div>
                            <strong>{userData.followers}</strong>
                            <div className={styles.statLabel}>Followers</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};