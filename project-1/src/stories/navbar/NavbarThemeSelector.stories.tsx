import type { Meta, StoryObj } from '@storybook/react';
import { NavbarThemeSelector } from '../../components/navbar/NavbarThemeSelector';

const meta = {
    title: 'Components/Navbar/ThemeSelector',
    component: NavbarThemeSelector,
    argTypes: {
        theme: { control: 'select', options: ['default', 'ocean', 'forest'] },
        onThemeChange: { action: 'theme-changed' }
    },
    args: {
        onThemeChange: () => { }
    }
} satisfies Meta<typeof NavbarThemeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        theme: 'default'
    }
};

export const Ocean: Story = {
    args: {
        theme: 'ocean'
    }
};
