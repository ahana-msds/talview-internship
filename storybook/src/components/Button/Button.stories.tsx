import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// meta configuration for the button stories
const meta = {
    title: 'Components/Button', // where the component appears in the sidebar
    component: Button,
    tags: ['autodocs'], // enables automatic documentation tab
    argTypes: {
        // defines controls for the props in the storybook ui
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'danger'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// primary story: default button state
export const Primary: Story = {
    args: {
        variant: 'primary',
        label: 'Primary Button',
    },
};

// secondary story: alternative button style
export const Secondary: Story = {
    args: {
        variant: 'secondary',
        label: 'Secondary Button',
    },
};

// danger story: used for destructive actions
export const Danger: Story = {
    args: {
        variant: 'danger',
        label: 'Danger Button',
    },
};

// large story: demonstrates size prop
export const Large: Story = {
    args: {
        size: 'large',
        label: 'Large Button',
    },
};

// disabled story: demonstrates disabled state
export const Disabled: Story = {
    args: {
        disabled: true,
        label: 'Disabled Button',
    },
};
