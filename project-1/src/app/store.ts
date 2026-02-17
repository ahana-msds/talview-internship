// Redux Toolkit for simplified store configuration
import { configureStore } from '@reduxjs/toolkit';

// Reducers and API definitions
import cartReducer from '../features/cart/cartSlice';
import { productsApi } from '../features/products/productsApi';
import { adminApi } from '../features/admin/adminApi';
import { todoApi } from '../features/todo/todoApi';

/**
 * configureStore: Sets up the global application state.
 * Includes local reducers (cart) and RTK Query generated reducers (products, admin, todo).
 */
export const store = configureStore({
    reducer: {
        // Shopping cart state
        cart: cartReducer,
        // Product API state
        [productsApi.reducerPath]: productsApi.reducer,
        // Admin API state
        [adminApi.reducerPath]: adminApi.reducer,
        // Todo API state
        [todoApi.reducerPath]: todoApi.reducer,
    },
    // Adding the middleware for RTK Query features (caching, invalidation, etc.)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productsApi.middleware, adminApi.middleware, todoApi.middleware),
});

// TypeScript types derived from the store for application usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
