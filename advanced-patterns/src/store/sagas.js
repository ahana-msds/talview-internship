import { throttle, put, select, delay } from 'redux-saga/effects';
import { logActivity, setLoading, selectUserActivityCount } from './userSlice.js';

// Worker Saga: Simple logger that uses 'select' to see current state
function* handleFrequentScroll(action) {
    const count = yield select(selectUserActivityCount);
    console.log(`[SAGA] Throttled scroll detected. Activity count so far: ${count}`);

    yield put(setLoading(true));
    yield delay(500); // Simulate some work
    yield put(logActivity(`Scroll event at ${new Date().toLocaleTimeString()}`));
    yield put(setLoading(false));
}

// Watcher Saga: Demonstrating 'throttle'
// It will ignore incoming 'USER_SCROLLED' actions for 2000ms after the first one
export default function* rootSaga() {
    console.log("[SAGA] Root saga started. Watching for 'USER_SCROLLED'...");
    yield throttle(2000, 'USER_SCROLLED', handleFrequentScroll);
}
