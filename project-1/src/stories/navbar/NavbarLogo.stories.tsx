// Storybook metadata and component imports
import type { Meta, StoryObj } from '@storybook/react';
import { NavbarLogo } from '../../components/navbar/NavbarLogo';

/**
 * Storybook configuration for the NavbarLogo component.
 */
const meta = {
    title: 'Components/Navbar/Logo',
    component: NavbarLogo,
} satisfies Meta<typeof NavbarLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story for the NavbarLogo.
 */
export const Default: Story = {};
