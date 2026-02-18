// Storybook metadata and component imports
import type { Meta, StoryObj } from '@storybook/react';
import { NavbarUserInfo } from '../../components/navbar/NavbarUserInfo';

/**
 * Storybook configuration for the NavbarUserInfo component.
 */
const meta = {
    title: 'Components/Navbar/UserInfo',
    component: NavbarUserInfo,
    argTypes: {
        displayName: { control: 'text' }
    }
} satisfies Meta<typeof NavbarUserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story representing the view for a guest user.
 */
export const Guest: Story = {
    args: {
        displayName: undefined
    }
};

/**
 * Story representing the view for a logged-in user with a specific name.
 */
export const LoggedIn: Story = {
    args: {
        displayName: "Ahana"
    }
};
