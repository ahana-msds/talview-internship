
import { call, put, takeLatest, delay } from 'redux-saga/effects';
import {
    FETCH_USER_REQUEST,
    fetchUserSuccess,
    fetchUserFailure,
    CANCEL_USER_FETCH
} from '../actions/userActions';

// simulated api call
const fetchUserApi = async (userId) => {
    // simulate network latency
    // using a promise directly here, but in real app would be fetch/axios
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 20% chance of failure to demo error handling
            if (Math.random() < 0.2) {
                reject(new Error('simulated network error'));
            } else {
                resolve({
                    id: userId,
                    name: `user ${userId}`,
                    email: `user${userId}@example.com`,
                    activityLog: ['login', 'view_page', 'logout']
                });
            }
        }, 1000);
    });
};

// worker saga: will be fired on FETCH_USER_REQUEST actions
function* fetchUserSaga(action) {
    try {
        // demo: 'call' effect is used for blocking calls (promises)
        // it makes testing easier as it returns a plain object description
        const user = yield call(fetchUserApi, action.payload);

        // demo: 'put' effect dispatches action to store
        yield put(fetchUserSuccess(user));
    } catch (e) {
        yield put(fetchUserFailure(e.message));
    }
}

// watcher saga: spawns a new fetchUserSaga on each FETCH_USER_REQUEST
export function* watchUserSaga() {
    // demo: 'takeLatest' automatically cancels any previous running task
    // if a new action comes in. perfect for type-ahead search or tab switching.
    yield takeLatest(FETCH_USER_REQUEST, fetchUserSaga);
}
