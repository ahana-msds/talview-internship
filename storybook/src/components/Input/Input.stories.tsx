import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

// meta configuration for the input stories
const meta = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        // dropdown for input types
        type: {
            control: 'select',
            options: ['text', 'password', 'email'],
        },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// default input story
export const Default: Story = {
    args: {
        label: 'Email',
        placeholder: 'Enter your email',
    },
};

// password input story
export const Password: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
    },
};

// error state story
export const WithError: Story = {
    args: {
        label: 'Username',
        placeholder: 'username',
        error: 'This username is already taken',
    },
};

// disabled input story
export const Disabled: Story = {
    args: {
        label: 'Locked Field',
        disabled: true,
        placeholder: 'Cannot edit this',
    },
};
