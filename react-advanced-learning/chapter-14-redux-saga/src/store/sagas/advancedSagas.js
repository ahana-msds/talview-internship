
import { race, call, put, take, delay, select, all } from 'redux-saga/effects';

// selector to get current user from state
const getUser = (state) => state.user.user;

// demo: race effect
// starts multiple effects in parallel and "wins" when the first one completes
// automatically cancels the losers
export function* raceSagaDemo() {
    console.log('starting race between fetch and timeout...');

    const { posts, timeout } = yield race({
        posts: call(delay, 1000, 'fetched posts'), // simulates a 1s fetch
        timeout: call(delay, 2000, 'timeout')      // simulates a 2s timeout
    });

    if (posts) {
        console.log('race winner: posts fetched successfully');
    } else {
        console.log('race winner: timed out!');
    }
}

// demo: accessing state with 'select'
// usually simpler to pass data in action, but sometimes access to global state is needed
export function* logUserActivitySaga() {
    // wait for a specific action (just a dummy action for demo)
    yield take('LOG_ACTIVITY_MANUAL');

    const user = yield select(getUser);
    if (user) {
        console.log(`logging activity for user: ${user.name}`);
    } else {
        console.log('no user logged in to log activity for');
    }
}

// root saga for advanced concepts, just exporting individually for composition in root
export function* advancedSagas() {
    yield all([
        // naturally we wouldn't run race immediately, usually inside a watcher
        // but calling here for console demo on load if hooked up
        call(raceSagaDemo),
    ]);
}
