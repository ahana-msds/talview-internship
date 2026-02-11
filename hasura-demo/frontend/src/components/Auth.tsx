import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useLazyQuery } from '@apollo/client/react';

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      username
      role
    }
  }
`;

const CHECK_CUSTOMER_SHIPMENTS = gql`
  query CheckCustomerShipments($id: Int!) {
    packages_aggregate(where: {
      _or: [
        { sender_id: { _eq: $id } },
        { receiver_id: { _eq: $id } }
      ]
    }) {
      aggregate {
        count
      }
    }
  }
`;

export const Auth: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const { data: userData } = useQuery<any>(GET_ALL_USERS);
    const [checkShipments] = useLazyQuery<any>(CHECK_CUSTOMER_SHIPMENTS);

    const handleUserChange = async (user: any) => {
        setError(null);

        if (user.role === 'customer') {
            const { data } = await checkShipments({ variables: { id: user.id } });
            const count = data?.packages_aggregate?.aggregate?.count || 0;

            if (count === 0) {
                setError(`Access Denied: ${user.username} has no active shipments. Please sign up to book a shipment.`);
                return;
            }
        }

        const initials = user.username.split(' ').map((n: string) => n[0]).join('').toUpperCase();
        const userToStore = { ...user, initials };

        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('role', user.role);
        window.location.reload();
    };

    const currentUser = storedUser || { username: 'Select User', initials: '??', role: 'none' };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                }}
            >
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                }}>
                    {currentUser.initials}
                </div>
            </button>

            {isOpen && (
                <>
                    <div
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        width: '280px',
                        backgroundColor: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '0.5rem',
                        zIndex: 50
                    }}>
                        <p style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Switch Account</p>

                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                margin: '0.5rem',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fee2e2',
                                borderRadius: '8px',
                                color: '#991b1b',
                                fontSize: '0.8rem'
                            }}>
                                {error}
                            </div>
                        )}

                        {userData?.users.map((user: any) => (
                            <div
                                key={user.id}
                                onClick={() => handleUserChange(user)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: user.id === currentUser.id ? 'var(--primary-light)' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: user.id === currentUser.id ? 'var(--primary)' : '#e2e8f0',
                                    color: user.id === currentUser.id ? 'white' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem'
                                }}>
                                    {user.username.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{user.username}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize' }}>{user.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
