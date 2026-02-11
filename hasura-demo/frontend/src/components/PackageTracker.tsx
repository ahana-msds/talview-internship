import { gql } from '@apollo/client';
import { useSubscription, useMutation, useQuery } from '@apollo/client/react';

const PACKAGES_SUBSCRIPTION = gql`
  subscription GetPackages {
    packages(order_by: {id: desc}) {
      id
      tracking_number
      contents
      status
      sender_name
      sender_phone
      sender_address
      receiver_name
      receiver_phone
      receiver_address
      agent { id username }
    }
  }
`;

const GET_RIDERS = gql`
  query GetRiders {
    users(where: {role: {_eq: "agent"}}) {
      id
      username
    }
  }
`;

const UPDATE_PACKAGE = gql`
  mutation UpdatePackage($id: Int!, $object: packages_set_input!) {
    update_packages_by_pk(pk_columns: {id: $id}, _set: $object) {
      id
      status
      agent_id
    }
  }
`;

export const PackageTracker: React.FC = () => {
    const { data, loading, error } = useSubscription<any>(PACKAGES_SUBSCRIPTION);
    const { data: riderData } = useQuery<any>(GET_RIDERS);
    const [updatePackage] = useMutation(UPDATE_PACKAGE);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const role = currentUser.role;

    if (loading) return <div style={{ opacity: 0.5, padding: '2rem', textAlign: 'center' }}>Synchronizing registry...</div>;
    if (error) return <p style={{ color: 'var(--danger)', padding: '1rem' }}>⚠️ Security Intercepted: {error.message}</p>;

    const packages = data?.packages || [];
    const riders = riderData?.users || [];

    const handleStatusChange = (id: number, status: string) => {
        updatePackage({ variables: { id, object: { status } } });
    };

    const handleAssignRider = (id: number, agent_id: number | null) => {
        updatePackage({ variables: { id, object: { agent_id } } });
    };

    const handleAcceptShipment = (id: number) => {
        updatePackage({ variables: { id, object: { agent_id: currentUser.id } } });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {packages.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
                    <p style={{ fontSize: '1.2rem' }}>No active shipments found.</p>
                </div>
            )}
            {packages.map((pkg: any) => (
                <div key={pkg.id} className="card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    borderLeft: `4px solid ${pkg.status === 'delivered' ? 'var(--success)' : (pkg.agent ? 'var(--primary)' : '#e2e8f0')}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{pkg.tracking_number}</span>
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: pkg.status === 'delivered' ? '#dcfce7' : '#dbeafe',
                                color: pkg.status === 'delivered' ? '#166534' : '#1e40af'
                            }}>
                                {pkg.status.replace('_', ' ')}
                            </span>
                            {!pkg.agent && <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e' }}>UNASSIGNED</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {/* RIDER ACTIONS */}
                            {role === 'agent' && !pkg.agent && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleAcceptShipment(pkg.id)}
                                        style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--success)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                        Accept
                                    </button>
                                    <button style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--danger)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                        Deny
                                    </button>
                                </div>
                            )}

                            {/* MANAGER ACTIONS */}
                            {role === 'manager' && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <select
                                        value={pkg.agent?.id || ''}
                                        onChange={(e) => handleAssignRider(pkg.id, e.target.value ? Number(e.target.value) : null)}
                                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}
                                    >
                                        <option value="">No Rider</option>
                                        {riders.map((r: any) => (
                                            <option key={r.id} value={r.id}>{r.username}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={pkg.status}
                                        onChange={(e) => handleStatusChange(pkg.id, e.target.value)}
                                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="picked_up">Picked Up</option>
                                        <option value="in_transit">In Transit</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </div>
                            )}

                            {/* RIDER STATUS UPDATE (ONLY FOR ASSIGNED) */}
                            {role === 'agent' && pkg.agent?.id === currentUser.id && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {pkg.status === 'pending' && (
                                        <button
                                            onClick={() => handleAssignRider(pkg.id, null)}
                                            style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', backgroundColor: '#94a3b8', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                            Release
                                        </button>
                                    )}
                                    {pkg.status !== 'delivered' && (
                                        <select
                                            value={pkg.status}
                                            onChange={(e) => handleStatusChange(pkg.id, e.target.value)}
                                            style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="picked_up">Picked Up</option>
                                            <option value="in_transit">In Transit</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Shipment Contents</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{pkg.contents}</p>
                            <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Rider</p>
                            <p style={{ margin: 0, fontWeight: 500 }}>{pkg.agent?.username || 'Waiting for acceptance...'}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>SENDER</p>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{pkg.sender_name || 'N/A'}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>{pkg.sender_phone || 'Contact Info Missing'}</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pkg.sender_address || 'Address not listed'}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>RECEIVER</p>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{pkg.receiver_name || 'N/A'}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>{pkg.receiver_phone || 'Contact Info Missing'}</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pkg.receiver_address || 'Address not listed'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
