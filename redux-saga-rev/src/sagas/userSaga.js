import { take, put, call, fork, takeEvery, takeLatest, select, delay } from 'redux-saga/effects';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from '../features/userSlice';

/**
 * 1. Introduction to Sagas (Demonstrated via usage)
 * Sagas are generator functions that manage side effects in Redux.
 * They run in the background and respond to actions dispatched to the store.
 * Benefits: Separation of concerns, handling complex async flows, easy testing.
 */

// Mock API Call
const fetchUserDataApi = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 'error') reject('Failed to fetch user');
            else resolve({ id, name: 'John Doe', role: 'Intern' });
        }, 1000);
    });
};

/**
 * 4. Generator Functions & Yield Keyword
 * Sagas use 'function*' to define generators.
 * 'yield' is used to pause the saga and wait for an effect to be handled by the middleware.
 */
function* handleFetchUser(action) {
    try {
        /**
         * 3. Effects: 'call'
         * 'call' tells the middleware to call a function. 
         * It's better than calling it directly because it makes the saga testable.
         */
        const userData = yield call(fetchUserDataApi, action.payload);

        /**
         * 3. Effects: 'put'
         * 'put' is like dispatching an action. It tells the middleware to dispatch
         * the result to the Redux store.
         */
        yield put(fetchUserSuccess(userData));
    } catch (error) {
        /**
         * 5. Handling Errors
         * Sagas use standard try/catch blocks to handle errors from called functions.
         */
        yield put(fetchUserFailure(error));
    }
}

/**
 * 5. takeEvery and takeLatest
 * takeEvery: Spawns a new saga for every action matching the pattern.
 * takeLatest: Cancels the previous saga if a new action of the same type is dispatched.
 */
export function* watchUserFetch() {
    // Demonstration of takeLatest: If multiple requests are made, only the last one is processed.
    yield takeLatest(fetchUserRequest.type, handleFetchUser);
}

/**
 * 3. Effects: 'fork' and 'take' (Manual loop)
 * 'fork' is a non-blocking effect. It starts a task in the background.
 * 'take' waits for a specific action to be dispatched.
 */
function* loggerSaga() {
    while (true) {
        const action = yield take('*'); // Take ANY action
        const state = yield select(); // 8. select effect to access state
        console.log('Action dispatched:', action.type, 'New State:', state);
    }
}

export function* userSaga() {
    /**
     * 3. 'fork' is used here to run multiple "watcher" sagas concurrently without blocking.
     */
    yield fork(watchUserFetch);
    yield fork(loggerSaga);
}
