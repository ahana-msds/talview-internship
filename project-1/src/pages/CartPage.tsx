import { Navbar } from '../components/Navbar';
import Cart from '../features/cart/Cart';
import { useNavigate } from 'react-router-dom';

export const CartPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ padding: '1rem 20px', textAlign: 'left' }}>
                <button
                    onClick={() => navigate('/products')}
                    className="btn btn-secondary"
                >
                    ← Back to Products
                </button>
            </div>
            <div className="container" style={{ padding: '1rem 20px', flex: 1, textAlign: 'left' }}>
                <Cart />
            </div>
        </div>
    );
};
