// Storybook metadata and component imports
import type { Meta, StoryObj } from '@storybook/react';
import { NavbarCartIcon } from '../../components/navbar/NavbarCartIcon';

/**
 * Storybook configuration for the NavbarCartIcon component.
 * Includes controls for the item count and interaction logging for the click event.
 */
const meta = {
    title: 'Components/Navbar/CartIcon',
    component: NavbarCartIcon,
    argTypes: {
        count: { control: { type: 'number', min: 0 } },
        onClick: { action: 'cart-clicked' }
    },
    args: {
        onClick: () => { }
    }
} satisfies Meta<typeof NavbarCartIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story representing an empty shopping cart.
 */
export const Empty: Story = {
    args: {
        count: 0
    }
};

/**
 * Story representing a cart with multiple items.
 */
export const WithItems: Story = {
    args: {
        count: 5
    }
};
