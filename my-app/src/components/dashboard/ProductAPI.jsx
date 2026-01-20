import React, { useState } from 'react';

const ProductAPI = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('https://fakestoreapi.com/products?limit=6');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feature-container">
            <h3>Product API Demo</h3>

            <button onClick={fetchProducts} className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Products'}
            </button>

            {error && <div className="error-message">{error}</div>}

            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.title} />
                        <h4>{product.title}</h4>
                        <p className="price">${product.price}</p>
                        <p className="category">{product.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductAPI;