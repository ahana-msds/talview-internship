import type { Meta, StoryObj } from '@storybook/react';
import { DashboardPage } from '../pages/DashboardPage';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';

const meta = {
    title: 'Pages/Dashboard',
    component: DashboardPage,
    parameters: {
        layout: 'fullscreen',
    },
    // Define controls here
    argTypes: {
        displayName: { control: 'text', description: 'Name of the logged in user' },
        provider: {
            control: 'select',
            options: ['email', 'github', 'google'],
            description: 'Login provider (github shows extra card)'
        }
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
} satisfies Meta<typeof DashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create mock auth context
const createMockAuth = (overrides = {}) => ({
    user: {
        uid: '123',
        displayName: 'Test User',
        email: 'test@example.com', // Fixed typo
        photoURL: null,
        provider: 'email' as const,
        ...overrides
    },
    loading: false,
    loginWithEmail: async () => { },
    signupWithEmail: async () => { },
    loginWithGoogle: async () => { },
    loginWithGithub: async () => { },
    loginAsGuest: async () => { },
    logout: async () => { }
});

// Using 'render' to pass args into the Context Provider
export const Interactive: Story = {
    args: {
        displayName: 'Interactive User',
        provider: 'email',
    },
    render: (args) => (
        <AuthContext.Provider value={createMockAuth({
            displayName: args.displayName,
            provider: args.provider
        })}>
            <DashboardPage />
        </AuthContext.Provider>
    ),
};

export const Default: Story = {
    render: () => (
        <AuthContext.Provider value={createMockAuth()}>
            <DashboardPage />
        </AuthContext.Provider>
    )
};
