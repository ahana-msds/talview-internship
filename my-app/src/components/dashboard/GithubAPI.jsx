import React, { useState } from 'react';

const GithubAPI = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchGithubUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setUserData(null);

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error('User not found');
            const data = await response.json();
            setUserData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feature-container">
            <h3>GitHub User Finder</h3>

            <form onSubmit={fetchGithubUser} className="github-form">
                <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {userData && (
                <div className="github-profile">
                    <img src={userData.avatar_url} alt={userData.login} className="avatar" />
                    <h4>{userData.name || userData.login}</h4>
                    <p className="bio">{userData.bio}</p>
                    <div className="github-stats">
                        <div className="stat">
                            <strong>{userData.public_repos}</strong>
                            <span>Repositories</span>
                        </div>
                        <div className="stat">
                            <strong>{userData.followers}</strong>
                            <span>Followers</span>
                        </div>
                        <div className="stat">
                            <strong>{userData.following}</strong>
                            <span>Following</span>
                        </div>
                    </div>
                    <div className="github-info">
                        <p><strong>Location:</strong> {userData.location || 'Not specified'}</p>
                        <p><strong>Blog:</strong> {userData.blog || 'None'}</p>
                        <p><strong>Company:</strong> {userData.company || 'None'}</p>
                        <a href={userData.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                            View Profile
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GithubAPI;