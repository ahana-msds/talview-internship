// Storybook metadata and component imports
import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from '../../components/dashboard/FeatureCard';

/**
 * Storybook configuration for the FeatureCard component.
 * Includes interaction logging for the onClick event.
 */
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

/**
 * Default story showing a generic feature card.
 */
export const Default: Story = {
    args: {
        title: 'Feature Title',
        description: 'This is a description of the feature.'
    }
};

/**
 * Specific story for the Task Manager feature card.
 */
export const TaskManager: Story = {
    args: {
        title: 'Task Manager',
        description: 'Manage your daily tasks efficiently.'
    }
};
