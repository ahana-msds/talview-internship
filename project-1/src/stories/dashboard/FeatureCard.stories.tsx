import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from '../../components/dashboard/FeatureCard';

const meta = {
    title: 'Components/Dashboard/FeatureCard',
    component: FeatureCard,
    argTypes: {
        onClick: { action: 'clicked' }
    },
    args: {
        onClick: () => { }
    }
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Feature Title',
        description: 'This is a description of the feature.'
    }
};

export const TaskManager: Story = {
    args: {
        title: 'Task Manager',
        description: 'Manage your daily tasks efficiently.'
    }
};
