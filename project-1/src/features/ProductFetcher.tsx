import { useState } from 'react';
import styles from './ProductFetcher.module.css';
interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}
export const ProductFetcher = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const handleFetch = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://fakestoreapi.com/products?limit=5');
            const data = await res.json();
            setProducts(data);
            setHasFetched(true);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={`card ${styles.featureCard}`}>
            <h3 className={styles.header}>
                Product API (Fetch)
            </h3>
            {!hasFetched && !loading && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ marginBottom: '1rem', opacity: 0.7 }}>Click below to load products</p>
                    <button onClick={handleFetch} className="btn">
                        Fetch Products
                    </button>
                </div>
            )}
            {loading && (
                <div className={styles.loading}>Loading products...</div>
            )}
            {hasFetched && !loading && (
                <div className={styles.list}>
                    {products.map(product => (
                        <div key={product.id} className={styles.item}>
                            <img src={product.image} alt={product.title} className={styles.image} />
                            <div>
                                <div className={styles.title}>{product.title}</div>
                                <div className={styles.price}>${product.price}</div>
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button onClick={handleFetch} className={`btn btn-secondary`} style={{ fontSize: '0.8rem' }}>
                            Refresh
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
