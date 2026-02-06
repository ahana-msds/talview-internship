import { configureStore } from '@reduxjs/toolkit';
import { postsApi } from '../services/postsApi';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        [postsApi.reducerPath]: postsApi.reducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postsApi.middleware),
});
