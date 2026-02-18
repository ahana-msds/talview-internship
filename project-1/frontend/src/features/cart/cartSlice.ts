import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
    loadCart,
    syncAddToBackend,
    syncUpdateToBackend,
    syncRemoveFromBackend,
    syncClearBackend,
    saveCartToIndexedDB,
} from './cartPersistence';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

interface CartState {
    items: CartItem[];
    loaded: boolean;
}

const initialState: CartState = {
    items: [],
    loaded: false,
};

/**
 * Async thunk: Load cart from backend (or IndexedDB fallback) on app startup.
 */
export const hydrateCart = createAsyncThunk('cart/hydrate', async () => {
    const items = await loadCart();
    return items;
});

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item) {
                item.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            // Fire-and-forget backend sync
            syncAddToBackend(action.payload).catch((err) =>
                console.warn('Cart sync (add) failed:', err)
            );
            saveCartToIndexedDB(state.items.map(i => ({ ...i }))).catch(() => { });
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
            // Fire-and-forget backend sync
            syncRemoveFromBackend(action.payload).catch((err) =>
                console.warn('Cart sync (remove) failed:', err)
            );
            saveCartToIndexedDB(state.items.map(i => ({ ...i }))).catch(() => { });
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
            }
            // Fire-and-forget backend sync
            syncUpdateToBackend(action.payload.id, action.payload.quantity).catch((err) =>
                console.warn('Cart sync (update) failed:', err)
            );
            saveCartToIndexedDB(state.items.map(i => ({ ...i }))).catch(() => { });
        },
        clearCart: (state) => {
            state.items = [];
            // Fire-and-forget backend sync
            syncClearBackend().catch((err) =>
                console.warn('Cart sync (clear) failed:', err)
            );
            saveCartToIndexedDB([]).catch(() => { });
        },
        setCartFromServer: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
            state.loaded = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(hydrateCart.fulfilled, (state, action) => {
            state.items = action.payload;
            state.loaded = true;
        });
        builder.addCase(hydrateCart.rejected, (state) => {
            state.loaded = true; // Mark as loaded even on failure
        });
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartFromServer } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartLoaded = (state: { cart: CartState }) => state.cart.loaded;

export default cartSlice.reducer;
