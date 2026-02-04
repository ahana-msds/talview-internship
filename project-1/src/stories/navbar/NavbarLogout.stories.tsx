// Storybook metadata and component imports
import type { Meta, StoryObj } from '@storybook/react';
import { NavbarLogout } from '../../components/navbar/NavbarLogout';

/**
 * Storybook configuration for the NavbarLogout component.
 * Includes interaction logging for the logout button click.
 */
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

/**
 * Default story for the logout button.
 */
export const Default: Story = {};
