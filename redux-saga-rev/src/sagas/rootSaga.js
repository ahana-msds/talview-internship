import { all, fork } from 'redux-saga/effects';
import { userSaga } from './userSaga';
import { advancedSaga } from './advancedSaga';

/**
 * 2. Connecting Saga to the Store
 * The Root Saga combines all separate sagas into a single entry point.
 * This is then passed to 'sagaMiddleware.run()' in the store configuration.
 *
 * 8. Advanced Topic: 'all' effect is used here to run multiple sagas in parallel.
 */
export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(advancedSaga),
    ]);
}
