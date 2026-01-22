import { Navbar } from '../components/Navbar';
import { ProductFetcher } from '../features/ProductFetcher';
import { Link } from 'react-router-dom';
export const ProductPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 20px', flex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
                </div>
                <h2>Product Catalog</h2>
                <div style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
                    <ProductFetcher />
                </div>
            </div>
        </div>
    );
};
