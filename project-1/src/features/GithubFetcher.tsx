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
interface GithubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    full_name: string;
}
interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'dir';
    html_url: string;
    download_url: string | null;
}
export const GithubFetcher = () => {
    // Global State
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Feature State
    const [view, setView] = useState<'profile' | 'repo'>('profile');
    // Data State
    const [userData, setUserData] = useState<GithubUser | null>(null);
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    // Repo View State
    const [currentRepo, setCurrentRepo] = useState<GithubRepo | null>(null);
    const [currentPath, setCurrentPath] = useState('');
    const [files, setFiles] = useState<FileItem[]>([]);
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        setLoading(true);
        setError('');
        setUserData(null);
        setRepos([]);
        setView('profile');
        try {
            // 1. Fetch User
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            if (!userRes.ok) throw new Error('User not found');
            const user = await userRes.json();
            setUserData(user);
            // 2. Fetch Repos
            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
            if (reposRes.ok) {
                const reposData = await reposRes.json();
                setRepos(reposData);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const openRepo = async (repo: GithubRepo) => {
        setCurrentRepo(repo);
        setCurrentPath('');
        setView('repo');
        await fetchContents(repo.full_name, '');
    };
    const fetchContents = async (fullName: string, path: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.github.com/repos/${fullName}/contents/${path}`);
            if (!res.ok) throw new Error('Failed to fetch contents');
            const data = await res.json();
            // data can be array (directory) or object (file)
            if (Array.isArray(data)) {
                // Sort: Directories first, then files
                const sorted = data.sort((a: FileItem, b: FileItem) => {
                    if (a.type === b.type) return a.name.localeCompare(b.name);
                    return a.type === 'dir' ? -1 : 1;
                });
                setFiles(sorted);
                setCurrentPath(path);
            } else {
                // It's a file, shouldn't happen via this flow usually unless we clicked a file directly
                // But if we did, we might want to show it. For now, simple directory browser.
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
                    <form onSubmit={handleSearch} className={styles.form}>
                        <input
                            className="input"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <button type="submit" className="btn" disabled={loading}>Search</button>
                    </form>
                    {error && <div className={styles.error}>{error}</div>}
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
