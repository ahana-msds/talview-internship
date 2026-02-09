import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/rootSaga';
import userReducer from '../features/userSlice';

// 1. Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// 2. Configure the store with middleware
export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    // Adding the saga middleware to the default middleware array
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// 3. Run the saga
sagaMiddleware.run(rootSaga);
