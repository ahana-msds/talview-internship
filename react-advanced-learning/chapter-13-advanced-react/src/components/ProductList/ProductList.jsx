
import React, { useState, useCallback } from 'react';
import ProductRow from './ProductRow';
import withActionLogger from '../HOC/withActionLogger';

// a button component wrapped with the logger hoc
const LoggedButton = withActionLogger(({ logAction, onClick, label }) => (
    <button onClick={() => {
        logAction(`clicked ${label}`);
        onClick();
    }} style={{ margin: '10px', padding: '5px 10px' }}>
        {label}
    </button>
));

const ProductList = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'laptop', price: 999 },
        { id: 2, name: 'phone', price: 699 },
        { id: 3, name: 'headphones', price: 199 },
    ]);

    const [filter, setFilter] = useState('');

    // function to delete product, wrapped in useCallback to keep reference stable
    // this is crucial for the purecomponent (react.memo) child to work effectively
    const deleteProduct = useCallback((id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    // derived state
    const filteredProducts = products.filter(p => p.name.includes(filter));

    return (
        <div className="product-list">
            <h3>Inventory</h3>

            <input
                type="text"
                placeholder="filter products..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ marginBottom: '20px', padding: '5px' }}
            />

            <div className="list-container">
                {filteredProducts.map(product => (
                    <ProductRow
                        key={product.id}
                        product={product}
                        onDelete={deleteProduct}
                    />
                ))}
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <p>hoc demo:</p>
                <LoggedButton label="refresh inventory" onClick={() => console.log('refreshing...')} />
            </div>
        </div>
    );
};

export default ProductList;
