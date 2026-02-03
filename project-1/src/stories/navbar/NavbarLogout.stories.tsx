import type { Meta, StoryObj } from '@storybook/react';
import { NavbarLogout } from '../../components/navbar/NavbarLogout';

const meta = {
    title: 'Components/Navbar/Logout',
    component: NavbarLogout,
    argTypes: {
        onLogout: { action: 'logout-clicked' }
    },
    args: {
        onLogout: () => { }
    }
} satisfies Meta<typeof NavbarLogout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
