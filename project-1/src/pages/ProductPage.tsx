import { Navbar } from '../components/Navbar';
import ProductList from '../features/products/ProductList';
import { useNavigate } from 'react-router-dom';

/**
 * ProductPage component displays the product catalog.
 * It allows users to browse and add products to their shopping cart.
 */
export const ProductPage = () => {
    const navigate = useNavigate();

    /**
     * Navigates back to the Dashboard.
     * Uses tab closure if applicable, or browser navigation.
     */
    const goToDashboard = () => {
        // Check if opened in new tab
        if (window.opener) {
            window.close();
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ padding: '1rem 20px', textAlign: 'left' }}>
                <button
                    onClick={goToDashboard}
                    className="btn btn-secondary"
                >
                    ← Back to Dashboard
                </button>
            </div>
            <div className="container" style={{ padding: '1rem 20px', flex: 1, textAlign: 'left' }}>
                <h2>Product Catalog</h2>
                <div style={{ marginTop: '1rem', width: '100%', maxWidth: '1200px', margin: '1rem auto' }}>
                    <ProductList />
                </div>
            </div>
        </div>
    );
};