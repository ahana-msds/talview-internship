import { all, race, call, put, take, delay, cancel, fork, throttle } from 'redux-saga/effects';
import { setAdvancedStatus } from '../features/userSlice';

/**
 * 8. Advanced Topics: all, race, cancel, throttle
 */

function* backgroundTask() {
    try {
        while (true) {
            console.log('Background task running...');
            yield delay(500);
        }
    } finally {
        // 8. Handling Cancellation
        console.log('Background task was cancelled!');
    }
}

/**
 * Demo of Race and Cancel
 * 'race' lets you wait for multiple effects, but only the first one to finish wins.
 * The others are automatically cancelled.
 */
function* demoRaceAndCancel() {
    yield put(setAdvancedStatus('Race starting...'));

    // Race between the background task and a timeout
    const { taskResult, timeout } = yield race({
        task: call(function* () {
            yield delay(2000);
            return 'Completed Successfully';
        }),
        timeout: delay(1000)
    });

    if (timeout) {
        yield put(setAdvancedStatus('Race lost to timeout!'));
    } else {
        yield put(setAdvancedStatus('Race won by task: ' + taskResult));
    }
}

/**
 * Demo of Throttle
 * 'throttle' ignores incoming actions for a specific period after the first one is handled.
 */
function* handleThrottleAction() {
    console.log('Throttled action handled!');
    yield put(setAdvancedStatus('Action Throttled'));
}

export function* watchAdvancedActions() {
    // Only handle this action once every 3 seconds
    yield throttle(3000, 'THROTTLE_REQUEST', handleThrottleAction);

    // Demonstration of manual cancellation
    const bgTask = yield fork(backgroundTask);
    yield delay(2000);
    yield cancel(bgTask); // 8. Cancel effect

    yield call(demoRaceAndCancel);
}

/**
 * 8. 'all' effect
 * 'all' is like Promise.all(). It runs effects in parallel and waits for all of them to finish.
 */
export function* advancedSaga() {
    yield all([
        watchAdvancedActions(),
        // Add other advanced watchers here
    ]);
}
