import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../components/Navbar';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

const meta = {
    title: 'Components/Navbar',
    component: Navbar,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <Provider store={store}>
                <BrowserRouter>
                    <ThemeProvider>
                        <AuthProvider>
                            <Story />
                        </AuthProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </Provider>
        ),
    ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import { AuthContext } from '../contexts/AuthContext';

export const LoggedIn: Story = {
    decorators: [
        (Story) => (
            <AuthContext.Provider value={{
                user: {
                    uid: '123',
                    displayName: 'Test User',
                    email: 'test@example.com',
                    photoURL: null,
                    provider: 'email'
                },
                loading: false,
                loginWithEmail: async () => { },
                signupWithEmail: async () => { },
                loginWithGoogle: async () => { },
                loginWithGithub: async () => { },
                loginAsGuest: async () => { },
                logout: async () => { }
            }}>
                <Story />
            </AuthContext.Provider>
        ),
    ],
};

