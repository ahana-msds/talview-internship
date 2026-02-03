import type { Meta, StoryObj } from '@storybook/react';
import { NavbarLogo } from '../../components/navbar/NavbarLogo';

const meta = {
    title: 'Components/Navbar/Logo',
    component: NavbarLogo,
} satisfies Meta<typeof NavbarLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
