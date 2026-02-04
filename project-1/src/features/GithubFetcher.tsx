// React and styling imports
import React, { useState } from 'react';
import styles from './GithubFetcher.module.css';

/**
 * Interface for GitHub User data.
 */
interface GithubUser {
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
}
interface GithubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    full_name: string;
}
/**
 * Interface for repository file/directory items.
 */
interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'dir';
    html_url: string;
    download_url: string | null;
}

/**
 * GithubFetcher: A comprehensive component for exploring the GitHub API.
 * Supports searching for users, viewing their repositories, and browsing repo contents.
 */
export const GithubFetcher = () => {
    // Global State
    // State for search query and search type (User or Repository)
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'user' | 'repo'>('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // state to toggle between profile view and repository content view
    const [view, setView] = useState<'profile' | 'repo'>('profile');

    // Data storage for api results
    const [userData, setUserData] = useState<GithubUser | null>(null);
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [searchRepoResults, setSearchRepoResults] = useState<GithubRepo[]>([]);

    // State for repo code browsing
    const [currentRepo, setCurrentRepo] = useState<GithubRepo | null>(null);
    const [currentPath, setCurrentPath] = useState('');
    const [files, setFiles] = useState<FileItem[]>([]);

    /**
     * handleSearch: Main entry point for performing GitHub API searches.
     * Branches logic based on whether searching for a user or a specific repository.
     */
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        setUserData(null);
        setRepos([]);
        setSearchRepoResults([]);
        setView('profile');

        try {
            if (searchType === 'user') {
                // 1. Fetch User profile data
                const userRes = await fetch(`https://api.github.com/users/${query}`);
                if (!userRes.ok) throw new Error('User not found');
                const user = await userRes.json();
                setUserData(user);
                // 2. Fetch the user's public repositories
                const reposRes = await fetch(`https://api.github.com/users/${query}/repos?sort=updated&per_page=30`);
                if (reposRes.ok) {
                    const reposData = await reposRes.json();
                    setRepos(reposData);
                }
            } else {
                // Perform a general repository search by name
                const res = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=30`);
                if (!res.ok) throw new Error('Failed to search repositories');
                const data = await res.json();
                setSearchRepoResults(data.items);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    /**
     * openRepo: Transitions to the repository content view.
     */
    const openRepo = async (repo: GithubRepo) => {
        setCurrentRepo(repo);
        setCurrentPath('');
        setView('repo');
        await fetchContents(repo.full_name, '');
    };

    /**
     * fetchContents: Fetches files/directories for a specific path in a repository.
     */
    const fetchContents = async (fullName: string, path: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.github.com/repos/${fullName}/contents/${path}`);
            if (!res.ok) throw new Error('Failed to fetch contents');
            const data = await res.json();
            // Data can be an array (for a directory) or an object (for a file)
            if (Array.isArray(data)) {
                // Sort contents: Directories first, then files alphabetically
                const sorted = data.sort((a: FileItem, b: FileItem) => {
                    if (a.type === b.type) return a.name.localeCompare(b.name);
                    return a.type === 'dir' ? -1 : 1;
                });
                setFiles(sorted);
                setCurrentPath(path);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleFileClick = async (item: FileItem) => {
        if (item.type === 'dir') {
            await fetchContents(currentRepo!.full_name, item.path);
        } else {
            // Open file in new tab (GitHub) to view content properly
            window.open(item.html_url, '_blank');
        }
    };
    const goBackToProfile = () => {
        setView('profile');
        setCurrentRepo(null);
    };
    const goUpDirectory = () => {
        if (!currentPath) return goBackToProfile();
        const parentPath = currentPath.split('/').slice(0, -1).join('/');
        fetchContents(currentRepo!.full_name, parentPath);
    };
    return (
        <div className={`card ${styles.featureCard}`}>
            {view === 'profile' && (
                <>
                    <h3 className={styles.header}>GitHub API Explorer</h3>

                    <div className={styles.searchType}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                checked={searchType === 'user'}
                                onChange={() => setSearchType('user')}
                            />
                            Search by User
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                checked={searchType === 'repo'}
                                onChange={() => setSearchType('repo')}
                            />
                            Search by Repository
                        </label>
                    </div>

                    <form onSubmit={handleSearch} className={styles.form}>
                        <input
                            className="input"
                            placeholder={searchType === 'user' ? "Username (e.g. facebook)" : "Repository name (e.g. react)"}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <button type="submit" className="btn" disabled={loading}>Search</button>
                    </form>
                    {error && <div className={styles.error}>{error}</div>}

                    {/* User Profile View */}
                    {userData && (
                        <div className={styles.profileSection}>
                            <div className={styles.profileHeader}>
                                <img src={userData.avatar_url} className={styles.avatar} alt="Profile" />
                                <div>
                                    <h4 className={styles.name}>{userData.name || userData.login}</h4>
                                    <p className={styles.bio}>{userData.bio}</p>
                                </div>
                            </div>
                            <div className={styles.divider}>Public Repositories</div>
                            <div className={styles.repoList}>
                                {repos.map(repo => (
                                    <div key={repo.id} onClick={() => openRepo(repo)} className={styles.repoItem}>
                                        <div className={styles.repoName}>{repo.name}</div>
                                        <div className={styles.repoDesc}>{repo.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Repository Search View */}
                    {searchRepoResults.length > 0 && (
                        <div className={styles.repoResults}>
                            {searchRepoResults.map(repo => (
                                <div key={repo.id} onClick={() => openRepo(repo)} className={styles.repoCard}>
                                    <div className={styles.repoFullName}>{repo.full_name}</div>
                                    <div className={styles.repoDesc}>{repo.description}</div>
                                    <div className={styles.stats} style={{ marginTop: '0.5rem' }}>
                                        <span>⭐ stars</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {view === 'repo' && currentRepo && (
                <>
                    <div className={styles.headerRow}>
                        <button onClick={goUpDirectory} className="btn btn-secondary">
                            {currentPath ? '.. Up' : '← Back to Profile'}
                        </button>
                        <h3 style={{ fontSize: '1rem', marginLeft: '1rem' }}>
                            {currentRepo.full_name}/{currentPath}
                        </h3>
                    </div>
                    {loading && <div>Loading...</div>}
                    <div className={styles.fileList}>
                        {files.map(file => (
                            <div key={file.path} onClick={() => handleFileClick(file)} className={styles.fileItem}>
                                <span className={styles.icon}>{file.type === 'dir' ? 'wf' : '📄'}</span>
                                {file.name}
                            </div>
                        ))}
                        {files.length === 0 && !loading && <div style={{ opacity: 0.5, padding: 20 }}>Empty directory</div>}
                    </div>
                </>
            )}
        </div>
    );
};
