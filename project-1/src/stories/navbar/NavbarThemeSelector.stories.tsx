// Storybook metadata and component imports
import type { Meta, StoryObj } from '@storybook/react';
import { NavbarThemeSelector } from '../../components/navbar/NavbarThemeSelector';

/**
 * Storybook configuration for the NavbarThemeSelector component.
 * Allows switching between themes and logs interaction events.
 */
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

/**
 * Default story showing the minimal theme selection.
 */
export const Default: Story = {
    args: {
        theme: 'default'
    }
};

/**
 * Story showing the selection of the Ocean theme.
 */
export const Ocean: Story = {
    args: {
        theme: 'ocean'
    }
};
