// Lucide icon for the shopping cart
import { ShoppingCart } from 'lucide-react';

interface NavbarCartIconProps {
    count: number;
    onClick: () => void;
}

/**
 * NavbarCartIcon: Displays a cart icon with a numeric badge for the total items.
 */
export const NavbarCartIcon = ({ count, onClick }: NavbarCartIconProps) => {
    return (
        <div style={{ position: 'relative', cursor: 'pointer', marginLeft: '15px' }} onClick={onClick}>
            <ShoppingCart size={24} />
            {/* Only show badge if there are items in the cart */}
            {count > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px'
                }}>
                    {count}
                </span>
            )}
        </div>
    );
};
