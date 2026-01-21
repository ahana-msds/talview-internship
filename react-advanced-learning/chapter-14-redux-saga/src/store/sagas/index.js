
import { all } from 'redux-saga/effects';
import { watchUserSaga } from './userSagas';
import { advancedSagas } from './advancedSagas';

// single entry point to start all sagas at once
export default function* rootSaga() {
    yield all([
        watchUserSaga(),
        advancedSagas(),
    ]);
}
