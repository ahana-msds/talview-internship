import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onNavigate: (tab: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onNavigate }) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        window.location.reload();
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#1e293b',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                position: 'fixed',
                height: '100vh'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ backgroundColor: 'var(--primary)', padding: '4px 8px', borderRadius: '4px' }}>L</span>
                    Logistics
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavItem active={activeTab === 'dashboard'} label="Command Center" icon="📊" onClick={() => onNavigate('dashboard')} />
                </nav>

                <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: '#334155', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <p style={{ opacity: 0.7 }}>Instance: <strong>v2.40.0</strong></p>
                    <p style={{ opacity: 0.7 }}>Region: <strong>US-East-1</strong></p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <header style={{
                    height: '64px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Command Center</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.username}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{currentUser.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', backgroundColor: 'white' }}
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                {/* Content */}
                <section style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </section>
            </main>
        </div>
    );
};

const NavItem = ({ label, icon, active = false, onClick }: { label: string, icon: string, active?: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: active ? 'white' : '#94a3b8',
            transition: 'all 0.2s'
        }}>
        <span>{icon}</span>
        <span style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
    </div>
);
