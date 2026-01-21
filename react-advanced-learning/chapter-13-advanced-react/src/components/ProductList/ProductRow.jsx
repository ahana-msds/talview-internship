
import React from 'react';

// product row component that receives product details
// using react.memo to prevent re-render if props represent the same product
const ProductRow = React.memo(({ product, onDelete }) => {
    console.log(`rendering row for ${product.name}`); // log to show when render happens

    return (
        <div className="product-row" style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <span>{product.name} - ${product.price}</span>
            {/* delete button triggering parent action */}
            <button
                onClick={() => onDelete(product.id)}
                style={{ marginLeft: '10px', background: 'red', color: 'white' }}
            >
                delete
            </button>
        </div>
    );
}, (prevProps, nextProps) => {
    // optional custom comparison function
    // return true if passing nextProps to render would return the same result
    return prevProps.product === nextProps.product;
});

export default ProductRow;
