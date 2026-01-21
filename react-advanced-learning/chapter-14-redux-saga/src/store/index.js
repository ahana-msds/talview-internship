
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import userReducer from './reducers/userReducer';
import rootSaga from './sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// configure store with reducers and middleware
const store = configureStore({
    reducer: {
        user: userReducer,
    },
    // append saga middleware to defaults
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// run the root saga
sagaMiddleware.run(rootSaga);

export default store;
