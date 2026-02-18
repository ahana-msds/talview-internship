import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
    phone: string;
}

/**
 * AddressPage: Manages user shipping addresses.
 * Users can view saved addresses and add new ones.
 */
export const AddressPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Local state for address management
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        pinCode: '',
        phone: ''
    });

    // Load addresses from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(`addresses_${user?.uid}`);
        if (saved) {
            setAddresses(JSON.parse(saved));
        }
    }, [user?.uid]);

    /**
     * handleSaveAddress: Adds a new address and persists it.
     */
    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        const newAddress: Address = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedAddresses = [...addresses, newAddress];
        setAddresses(updatedAddresses);
        localStorage.setItem(`addresses_${user?.uid}`, JSON.stringify(updatedAddresses));

        // Reset form and hide it
        setFormData({ street: '', city: '', state: '', pinCode: '', phone: '' });
        setShowForm(false);
    };

    /**
     * removeAddress: Deletes an address by ID.
     */
    const removeAddress = (id: string) => {
        const updated = addresses.filter(a => a.id !== id);
        setAddresses(updated);
        localStorage.setItem(`addresses_${user?.uid}`, JSON.stringify(updated));
    };

    return (
        <div className="pageWrapper">
            <Navbar />
            <div className="container">
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                    ← Back to Dashboard
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ margin: 0 }}>My Addresses</h1>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className="btn">
                            + Add New Address
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="card" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Add New Address</h2>
                        <form onSubmit={handleSaveAddress}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Street Address</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>City</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>State</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Pin Code</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.pinCode}
                                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>
                                    Save Address
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {addresses.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
                        <p style={{ fontSize: '1.2rem' }}>No addresses saved yet.</p>
                        <p>Add your first shipping address using the button above.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {addresses.map(address => (
                            <div key={address.id} className="card" style={{ position: 'relative', textAlign: 'left' }}>
                                <button
                                    onClick={() => removeAddress(address.id)}
                                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', color: '#e74c3c', fontSize: '1.2rem', padding: '5px' }}
                                    title="Delete address"
                                >
                                    🗑️
                                </button>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Shipping Address</h3>
                                <p style={{ marginBottom: '0.2rem' }}>{address.street}</p>
                                <p style={{ marginBottom: '0.2rem' }}>{address.city}, {address.state}</p>
                                <p style={{ marginBottom: '1rem' }}>{address.pinCode}</p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>📞 {address.phone}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
