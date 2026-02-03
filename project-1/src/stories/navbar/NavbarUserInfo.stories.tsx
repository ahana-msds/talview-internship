import type { Meta, StoryObj } from '@storybook/react';
import { NavbarUserInfo } from '../../components/navbar/NavbarUserInfo';

const meta = {
    title: 'Components/Navbar/UserInfo',
    component: NavbarUserInfo,
    argTypes: {
        displayName: { control: 'text' }
    }
} satisfies Meta<typeof NavbarUserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guest: Story = {
    args: {
        displayName: undefined
    }
};

export const LoggedIn: Story = {
    args: {
        displayName: "Ahana"
    }
};
