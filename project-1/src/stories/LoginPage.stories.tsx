import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LoginPage } from '../pages/LoginPage';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';

const meta = {
    title: 'Pages/Login',
    component: LoginPage,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        uiScale: { control: { type: 'range', min: 0.5, max: 2, step: 0.1 }, description: 'Scale the UI size' },
        loginDelay: { control: { type: 'range', min: 0, max: 5000, step: 500 }, description: 'Simulated network delay (ms)' },
        shouldFail: { control: 'boolean', description: 'Simulate login failure' },
        errorMessage: { control: 'text', description: 'Error message to display on failure' }
    },
    decorators: [
        (Story) => (
            <Provider store={store}>
                <BrowserRouter>
                    <ThemeProvider>
                        <Story />
                    </ThemeProvider>
                </BrowserRouter>
            </Provider>
        ),
    ],
} satisfies Meta<typeof LoginPage>;

export default meta;

type LoginPageStoryState = React.ComponentProps<typeof LoginPage> & {
    uiScale: number;
    loginDelay: number;
    shouldFail: boolean;
    errorMessage: string;
};
type Story = StoryObj<LoginPageStoryState>;

export const Interactive: Story = {
    args: {
        uiScale: 1,
        loginDelay: 1000,
        shouldFail: false,
        errorMessage: 'Invalid credentials'
    },
    render: (args) => {
        const mockAuth = {
            user: null,
            loading: false,
            loginWithEmail: async () => {
                await new Promise(resolve => setTimeout(resolve, args.loginDelay));
                if (args.shouldFail) {
                    throw new Error(args.errorMessage);
                }
            },
            signupWithEmail: async () => { },
            loginWithGoogle: async () => { },
            loginWithGithub: async () => { },
            loginAsGuest: async () => { },
            logout: async () => { }
        };

        return (
            <div style={{ transform: `scale(${args.uiScale})`, transformOrigin: 'top left', height: '100vh', width: '100vw' }}>
                {/* @ts-ignore */}
                <AuthContext.Provider value={mockAuth}>
                    <LoginPage />
                </AuthContext.Provider>
            </div>
        );
    }
};
