// RTK Query hook for fetching products
import { useGetProductsQuery } from './productsApi';
// Redux dispatch for adding items to the cart
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';

// Type definitions for products
import type { Product } from './productsApi';

interface ProductListProps {
    products?: Product[]; // Optional prop to inject local data (useful for stories)
}

/**
 * ProductList: Fetches and displays products from a server-side API.
 * Allows users to add items to their local shopping cart.
 */
const ProductList = ({ products: injectedProducts }: ProductListProps) => {
    // Execute the RTK Query fetch if no local data is provided
    const { data, error, isLoading } = useGetProductsQuery(undefined, { skip: !!injectedProducts });
    const dispatch = useDispatch();

    // Use either the injected products or the fetched data
    const products = injectedProducts || data?.products;

    // Handle loading and error states for the network request
    if (!injectedProducts && isLoading) return <p>Loading products...</p>;
    if (!injectedProducts && error) return <p>Error loading products</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Products (Server State)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {products?.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                        {/* Product Image and Details */}
                        <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                        {/* Interaction: Adding to Redux cart state */}
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
