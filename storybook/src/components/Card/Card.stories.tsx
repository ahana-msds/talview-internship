import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';

// meta configuration for the card stories
const meta = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// default card story
export const Default: Story = {
    args: {
        title: 'New Account',
        content: 'Please fill out your billing information to get started with the premium features.',
    },
};

// card with action buttons in the footer
export const WithActions: Story = {
    args: {
        title: 'Confirm Operation',
        content: 'Are you sure you want to delete this resource? This action cannot be undone.',
        footer: (
            <>
                <Button label="Cancel" variant="secondary" size="small" />
                <Button label="Confirm" variant="danger" size="small" />
            </>
        ),
    },
};

// large content card story
export const LongContent: Story = {
    args: {
        title: 'Terms of Service',
        content: 'By using this application, you agree to follow the terms and conditions outlined in the user agreement. Please read the documentation carefully to understand your rights and responsibilities.',
    },
};
