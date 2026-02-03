import { useGetProductsQuery } from './productsApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';

import type { Product } from './productsApi';

interface ProductListProps {
    products?: Product[];
}

const ProductList = ({ products: injectedProducts }: ProductListProps) => {
    const { data, error, isLoading } = useGetProductsQuery(undefined, { skip: !!injectedProducts });
    const dispatch = useDispatch();

    const products = injectedProducts || data?.products;

    if (!injectedProducts && isLoading) return <p>Loading products...</p>;
    if (!injectedProducts && error) return <p>Error loading products</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Products (Server State)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {products?.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                        <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                        <button
                            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
                            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
