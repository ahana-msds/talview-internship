import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from './cartSlice';

const Cart = () => {
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const dispatch = useDispatch();

    return (
        <div style={{ padding: '20px', borderTop: '2px solid #333', marginTop: '20px' }}>
            <h2>Shopping Cart (Client State)</h2>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {items.map((item) => (
                            <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <img src={item.thumbnail} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                                <div style={{ flexGrow: 1 }}>
                                    <h4>{item.title}</h4>
                                    <p>${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div>
                                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}>-</button>
                                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                                    <button onClick={() => dispatch(removeFromCart(item.id))} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ${total.toFixed(2)}</h3>
                </>
            )}
        </div>
    );
};

export default Cart;
