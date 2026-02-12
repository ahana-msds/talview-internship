import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client/react';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      role
    }
  }
`;

const CALCULATE_QUOTE = gql`
  query CalculateQuote($input: ShippingInput!) {
    calculate_quote(input: $input) {
      cost
      eta
    }
  }
`;

const INSERT_PACKAGE = gql`
  mutation InsertPackage(
    $contents: String!, 
    $receiver_id: Int!, 
    $sender_id: Int!,
    $sender_name: String!,
    $sender_phone: String!,
    $sender_address: String!,
    $receiver_name: String!,
    $receiver_phone: String!,
    $receiver_address: String!
  ) {
    insert_packages_one(object: {
      contents: $contents, 
      receiver_id: $receiver_id, 
      sender_id: $sender_id,
      sender_name: $sender_name,
      sender_phone: $sender_phone,
      sender_address: $sender_address,
      receiver_name: $receiver_name,
      receiver_phone: $receiver_phone,
      receiver_address: $receiver_address,
      status: "pending"
    }) {
      id
      tracking_number
    }
  }
`;

interface NewShipmentModalProps {
    onClose: () => void;
}

export const NewShipmentModal: React.FC<NewShipmentModalProps> = ({ onClose }) => {
    const [contents, setContents] = useState('');
    const [receiverId, setReceiverId] = useState<number | ''>('');

    // Sender Details
    const [senderName, setSenderName] = useState('');
    const [senderPhone, setSenderPhone] = useState('');
    const [senderAddress, setSenderAddress] = useState('');

    // Receiver Details
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');

    // Calculator State
    const [weight, setWeight] = useState<number>(0);
    const [distance, setDistance] = useState<number>(0);
    const [isExpress, setIsExpress] = useState<boolean>(false);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const { data: userData } = useQuery<any>(GET_USERS);

    // Calculator Action
    const [getQuote, { data: quoteData, loading: calculating, error: quoteError }] = useLazyQuery<any>(CALCULATE_QUOTE, {
        fetchPolicy: 'network-only'
    });

    const quote = quoteData?.calculate_quote;

    const [insertPackage, { loading, error }] = useMutation<any>(INSERT_PACKAGE, {
        onCompleted: (data) => {
            alert(`Shipment Created! Tracking ID: ${data.insert_packages_one.tracking_number}`);
            onClose();
        },
        refetchQueries: ['GetPackages', 'GetTotalStats', 'GetInTransitStats', 'GetDeliveredStats']
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contents || !receiverId || !currentUser.id) {
            alert('Please fill out all required fields');
            return;
        }

        insertPackage({
            variables: {
                contents,
                receiver_id: Number(receiverId),
                sender_id: Number(currentUser.id || 0),
                sender_name: senderName,
                sender_phone: senderPhone,
                sender_address: senderAddress,
                receiver_name: receiverName,
                receiver_phone: receiverPhone,
                receiver_address: receiverAddress
            }
        });
    };

    const receivers = userData?.users.filter((u: any) => u.role === 'customer' || u.role === 'manager') || [];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Book New Shipment</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Shipping Calculator Section */}
                    <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#0369a1' }}>Smart Shipping Calculator 🧮</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Weight (kg)</label>
                                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Distance (km)</label>
                                <input type="number" value={distance} onChange={e => setDistance(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={isExpress} onChange={e => setIsExpress(e.target.checked)} />
                                    Express ⚡
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => getQuote({ variables: { input: { weight, distance, express: isExpress } } })}
                                disabled={calculating}
                                style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer', height: '38px' }}
                            >
                                {calculating ? '...' : 'Get Quote'}
                            </button>
                        </div>

                        {quoteError && (
                            <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                ⚠️ {quoteError.message} (Try weight &lt; 50kg)
                            </div>
                        )}

                        {quote && (
                            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', paddingTop: '0.75rem', borderTop: '1px dashed #bae6fd' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ESTIMATED COST</span>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: '#0369a1' }}>${quote.cost}</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ESTIMATED DELIVERY</span>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: '#0369a1' }}>{quote.eta}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Package Contents</label>
                        <input
                            type="text"
                            value={contents}
                            onChange={(e) => setContents(e.target.value)}
                            placeholder="e.g. Fragile Electronics"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Sender Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Sender Info</h3>
                            <input placeholder="Sender Name" value={senderName} onChange={e => setSenderName(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
                            <input placeholder="Sender Phone" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
                            <textarea placeholder="Sender Address" value={senderAddress} onChange={e => setSenderAddress(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '60px' }} required />
                        </div>

                        {/* Receiver Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Receiver Info</h3>
                            <select
                                value={receiverId}
                                onChange={(e) => setReceiverId(Number(e.target.value))}
                                style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                required
                            >
                                <option value="">Select Account</option>
                                {receivers.map((u: any) => (
                                    <option key={u.id} value={u.id}>{u.username}</option>
                                ))}
                            </select>
                            <input placeholder="Recipient Name" value={receiverName} onChange={e => setReceiverName(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
                            <input placeholder="Recipient Phone" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
                            <textarea placeholder="Recipient Address" value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '60px' }} required />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error.message}</p>}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {loading ? 'Processing...' : 'Generate Bill & Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
