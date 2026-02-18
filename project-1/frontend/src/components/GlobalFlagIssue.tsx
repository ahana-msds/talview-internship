import { useState } from 'react';
import * as Sentry from '@sentry/react';

export const GlobalFlagIssue = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [issueType, setIssueType] = useState('bug');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventId = Sentry.captureMessage(`[${issueType.toUpperCase()}] ${description}`);
        Sentry.showReportDialog({ eventId });
        setIsOpen(false);
        setDescription('');
        alert('Thank you for your feedback! Admin has been notified.');
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-secondary"
                    style={{ borderRadius: '50px', padding: '12px 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                >
                    🚩 Flag Issue
                </button>
            ) : (
                <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Flag an Issue</h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--color-text)' }}>&times;</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Type of Issue</label>
                            <select
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                className="input"
                                style={{ width: '100%' }}
                            >
                                <option value="bug">🐛 Technical Bug</option>
                                <option value="ui">🎨 UI/UX Issue</option>
                                <option value="logic">🧠 Logic Error</option>
                                <option value="other">❓ Other</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Description</label>
                            <textarea
                                className="input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What went wrong?"
                                style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Submit Report</button>
                    </form>
                </div>
            )}
        </div>
    );
};
