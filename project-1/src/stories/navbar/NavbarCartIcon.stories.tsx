import type { Meta, StoryObj } from '@storybook/react';
import { NavbarCartIcon } from '../../components/navbar/NavbarCartIcon';

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

export const Empty: Story = {
    args: {
        count: 0
    }
};

export const WithItems: Story = {
    args: {
        count: 5
    }
};
