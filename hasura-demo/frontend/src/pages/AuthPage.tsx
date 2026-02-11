import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useLazyQuery } from '@apollo/client/react';

const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    users(where: {email: {_eq: $email}, password: {_eq: $password}}) {
      id
      username
      role
      email
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    insert_users_one(object: {
      username: $username,
      email: $email,
      password: $password,
      role: $role
    }) {
      id
      username
      role
    }
  }
`;

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState<string | null>(null);

    const [login, { loading: loginLoading }] = useLazyQuery<any>(LOGIN_QUERY);

    const [signup, { loading: signupLoading }] = useMutation<any>(SIGNUP_MUTATION, {
        onCompleted: (data: any) => {
            const user = data.insert_users_one;
            const initials = user.username.split(' ').map((n: string) => n[0]).join('').toUpperCase();
            localStorage.setItem('currentUser', JSON.stringify({ ...user, initials }));
            localStorage.setItem('userId', user.id.toString());
            localStorage.setItem('role', user.role);
            window.location.reload();
        },
        onError: (err: any) => setError(err.message)
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log('🚀 Attempting login for:', email);

        if (isLogin) {
            try {
                const response = await login({ variables: { email, password } });
                console.log('📡 Login query executed:', response);

                if (response.error) {
                    setError(`Sync Error: ${response.error.message}`);
                    return;
                }

                if (!response.data || response.data.users.length === 0) {
                    setError('Invalid email or password');
                    return;
                }

                const user = response.data.users[0];
                console.log('✅ Identity Verified:', user.username);

                const initials = user.username.split(' ').map((n: string) => n[0]).join('').toUpperCase();
                localStorage.setItem('currentUser', JSON.stringify({ ...user, initials }));
                localStorage.setItem('userId', user.id.toString());
                localStorage.setItem('role', user.role);
                window.location.reload();
            } catch (err: any) {
                console.error('❌ Authentication Crash:', err);
                setError(err.message || 'Authentication system failure. Check console.');
            }
        } else {
            console.log('📝 Registering new user:', username);
            signup({ variables: { username, email, password, role } });
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
            <div className="card" style={{ width: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.5rem'
                    }}>L</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{isLogin ? 'Welcome Back' : 'Join Logistics'}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isLogin ? 'Enter your credentials to manage fleet' : 'Create an account to start shipping'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setUsername(name);
                                    const sanitized = name.toLowerCase().replace(/\s+/g, '_');
                                    setEmail(`${sanitized}@${role === 'agent' ? 'rider' : 'customer'}.com`);
                                }}
                                placeholder="John Doe"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: !isLogin ? '#f8fafc' : 'white' }}
                            readOnly={!isLogin}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>I am a...</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRole('customer');
                                        const sanitized = username.toLowerCase().replace(/\s+/g, '_');
                                        if (sanitized) setEmail(`${sanitized}@customer.com`);
                                    }}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: role === 'customer' ? 'var(--primary)' : 'white',
                                        color: role === 'customer' ? 'white' : 'var(--text)',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Customer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRole('agent');
                                        const sanitized = username.toLowerCase().replace(/\s+/g, '_');
                                        if (sanitized) setEmail(`${sanitized}@rider.com`);
                                    }}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: role === 'agent' ? 'var(--primary)' : 'white',
                                        color: role === 'agent' ? 'white' : 'var(--text)',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Rider
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#991b1b', fontSize: '0.8rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loginLoading || signupLoading}
                        style={{
                            width: '100%',
                            padding: '0.85rem',
                            borderRadius: '8px',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            marginTop: '0.5rem'
                        }}
                    >
                        {loginLoading || signupLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        style={{ color: 'var(--primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};
