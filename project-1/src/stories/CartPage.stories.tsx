import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CartPage } from '../pages/CartPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from '../features/cart/cartSlice';
import { productsApi } from '../features/products/productsApi';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';

const meta = {
    title: 'Pages/Cart',
    component: CartPage,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        itemCount: { control: { type: 'range', min: 0, max: 10 }, description: 'Number of items in cart' },
        uiScale: { control: { type: 'range', min: 0.5, max: 2, step: 0.1 }, description: 'Scale the UI size' },
    },
} satisfies Meta<typeof CartPage>;

export default meta;

type CartPageStoryState = React.ComponentProps<typeof CartPage> & {
    itemCount: number;
    uiScale: number;
};
type Story = StoryObj<CartPageStoryState>;

const generateCartItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        price: 10.00 * (i + 1),
        quantity: 1,
        thumbnail: 'https://placehold.co/100',
        description: 'desc',
        discountPercentage: 0,
        rating: 5,
        stock: 50,
        brand: 'brand',
        category: 'cat',
        images: []
    }));
};

// We create the store content dynamically based on args
export const Interactive: Story = {
    args: {
        itemCount: 3,
        uiScale: 1,
    },
    render: (args) => {
        const store = configureStore({
            reducer: {
                cart: cartSlice.reducer,
                [productsApi.reducerPath]: productsApi.reducer,
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(productsApi.middleware),
            preloadedState: {
                cart: {
                    items: generateCartItems(args.itemCount)
                }
            }
        });

        return (
            <div style={{ transform: `scale(${args.uiScale})`, transformOrigin: 'top left', minHeight: '100vh' }}>
                <Provider store={store}>
                    <BrowserRouter>
                        <ThemeProvider>
                            <AuthContext.Provider value={{
                                user: { uid: '123', displayName: 'User', email: 'test@email.com', photoURL: null, provider: 'email' },
                                loading: false,
                                loginWithEmail: async () => { },
                                signupWithEmail: async () => { },
                                loginWithGoogle: async () => { },
                                loginWithGithub: async () => { },
                                loginAsGuest: async () => { },
                                logout: async () => { }
                            }}>
                                <CartPage />
                            </AuthContext.Provider>
                        </ThemeProvider>
                    </BrowserRouter>
                </Provider>
            </div>
        );
    }
};
